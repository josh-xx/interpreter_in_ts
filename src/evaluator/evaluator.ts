import {
    AstNode,
    BooleanLiteral,
    Expression,
    ExpressionStatement,
    Identifier,
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

export const evalPrefixExpression = (operator: string, right: ObjectBase) => {
    if (right === null) throw 'bad right expression'

    if (operator === '!') {
        return evalBangOperatorExpression(right)
    } else {
        throw `unsupported operator ${operator}`
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
    } else if (node instanceof Identifier && node.value === 'null') {
        return new ObjectNull()
    }
    console.log(node)
    return new ObjectInteger(1)
}
