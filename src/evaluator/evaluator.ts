import {AstNode, BooleanLiteral, ExpressionStatement, Identifier, IntLiteral, Program, Statement} from "../ast/ast";
import {ObjectBase, ObjectBoolean, ObjectInteger, ObjectNull} from "../object/object";

export const evalStatements = (statements: Statement[]) => {
    let result: ObjectBase = evaluate(statements[0])
    for (const statement of statements.slice(1)) {
        result = evaluate(statement)
    }

    return result
}

export const evaluate = (node: AstNode): ObjectBase => {
    if (node instanceof Program) {
        return evalStatements(node.statements)
    } else if (node instanceof ExpressionStatement) {
        return evaluate(node.expression)
    } else if (node instanceof IntLiteral) {
        return new ObjectInteger(node.value)
    } else if (node instanceof Identifier && node.value === 'null') {
        return new ObjectNull()
    }
    console.log(node)
    return new ObjectInteger(1)
}
