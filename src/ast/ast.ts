import {Token} from "../token/token";

interface AstNode {
    tokenLiteral(): string
}

export interface Statement extends AstNode {
    statementNode(): any
}

export interface Expression extends AstNode {
    expressionNode(): any
}

export class Program {
    constructor(
        public statements: Statement[] = []
    ) {}

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral()
        } else {
            return ''
        }
    }
}

export class Identifier {
    constructor(
        public token: Token,
        public value: string,
    ) {}
    expressionNode() {}
}

export class LetStatement implements Statement {
    // let a = 5 * 1
    constructor(
        public token: Token,
        public name: Identifier,
        // public value: Expression,
        public value: null,
    ) {}
    statementNode() {}
    tokenLiteral(): string {
        // TODO
        // return `${this.token.literal} ${this.name.value} = ${this.value.tokenLiteral()}`
        return this.token.literal
    }
}
