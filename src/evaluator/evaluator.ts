import {
    AstNode,
    BlockStatement,
    BooleanLiteral,
    Expression,
    ExpressionStatement,
    Identifier,
    IfExpression,
    InfixExpression,
    IntLiteral,
    PrefixExpression,
    Program,
    Statement
} from "../ast/ast";
import {ObjectBase, ObjectBoolean, ObjectInteger, ObjectNull} from "../object/object";

export const evalStatements = (statements: Statement[]) => {
    let result: ObjectBase = evaluate(statements[0])
    for (const statement of statements.slice(1)) {
        result = evaluate(statement)
    }

    return result
}

export const evalBangOperatorExpression = (right: ObjectBase) => {
    if (right instanceof ObjectBoolean) {
        return new ObjectBoolean(!right.value)
    } else if (right instanceof ObjectInteger) {
        return new ObjectBoolean(!right.value)
    } else if (right instanceof ObjectNull) {
        return new ObjectBoolean(true)
    } else {
        throw `bad right evaluated`
    }
}

export const evalMinusPrefixOperatorExpression = (right: ObjectBase) => {
    if (right instanceof ObjectInteger) {
        return new ObjectInteger(-right.value)
    } else {
        throw `bad right evaluated`
    }
}

export const evalPrefixExpression = (operator: string, right: ObjectBase) => {
    if (operator === '!') {
        return evalBangOperatorExpression(right)
    } else if (operator === '-') {
        return evalMinusPrefixOperatorExpression(right)
    } else {
        throw `unsupported operator ${operator}`
    }
}

export const evalIntegerInfixExpression = (operator: string, left: ObjectInteger, right: ObjectInteger) => {
    if (operator === '+') {
        return new ObjectInteger(left.value + right.value)
    } else if (operator === '-') {
        return new ObjectInteger(left.value - right.value)
    } else if (operator === '*') {
        return new ObjectInteger(left.value * right.value)
    } else if (operator === '/') {
        return new ObjectInteger(left.value / right.value)
    } else if (operator === '<') {
        return new ObjectBoolean(left.value < right.value)
    } else if (operator === '>') {
        return new ObjectBoolean(left.value > right.value)
    } else if (operator === '==') {
        return new ObjectBoolean(left.value == right.value)
    } else if (operator === '!=') {
        return new ObjectBoolean(left.value != right.value)
    } else {
        throw `unsupported operator ${operator}`
    }
}

export const evalBooleanInfixExpression = (operator: string, left: ObjectBoolean, right: ObjectBoolean) => {
    if (operator === '==') {
        return new ObjectBoolean(left.value == right.value)
    } else if (operator === '!=') {
        return new ObjectBoolean(left.value != right.value)
    } else {
        throw `unsupported operator ${operator}`
    }
}

export const evalInfixExpression = (operator: string, left: ObjectBase, right: ObjectBase) => {
    if (left instanceof ObjectInteger && right instanceof ObjectInteger) {
        return evalIntegerInfixExpression(operator, left, right)
    } else if (left instanceof ObjectBoolean && right instanceof ObjectBoolean) {
        return evalBooleanInfixExpression(operator, left, right)
    } else {
        throw 'unsupported infix'
    }
}

export const evalIfExpression = (expression: IfExpression) => {
    let condition = evaluate(expression.condition)

    let isTruthy = false
    if (condition instanceof ObjectInteger) {
        isTruthy = Boolean(condition.value)
    } else if (condition instanceof ObjectBoolean) {
        isTruthy = condition.value
    } else if (condition instanceof ObjectNull) {
        isTruthy = false
    }

    if (isTruthy) {
        return evaluate(expression.consequences)
    } else {
        if (expression.alternatives) {
            return evaluate(expression.alternatives)
        } else {
            return new ObjectNull()
        }
    }
}

export const evaluate = (node: AstNode): ObjectBase => {
    if (node instanceof Program) {
        return evalStatements(node.statements)
    } else if (node instanceof ExpressionStatement) {
        return evaluate(node.expression)
    } else if (node instanceof IntLiteral) {
        return new ObjectInteger(node.value)
    } else if (node instanceof BooleanLiteral) {
        return new ObjectBoolean(node.value)
    } else if (node instanceof PrefixExpression) {
        if (node.right === null) throw `bad expression`
        let right = evaluate(node.right)
        return evalPrefixExpression(node.operator, right)
    } else if (node instanceof InfixExpression) {
        if (node.right === null) throw `bad expression`
        if (node.left === null) throw `bad expression`

        let right = evaluate(node.right)
        let left = evaluate(node.left)

        return evalInfixExpression(node.operator, left, right)
    } else if (node instanceof IfExpression) {
        return evalIfExpression(node)
    } else if (node instanceof BlockStatement) {
        let ss = []
        for (let s of node.statements) {
            if (s !== null) ss.push(s)
        }
        return evalStatements(ss)
    } else if (node instanceof Identifier && node.value === 'null') {
        return new ObjectNull()
    }
    return new ObjectInteger(1)
}
