import {Token, TokenType} from "../token/token";

interface AstNode {
    tokenLiteral(): string
    string(): string
}

interface Statement extends AstNode {
}

interface Expression extends AstNode {
}

export class Program {
    constructor(
        public statements: Statement[] = []
    ) {}
}

export class Identifier implements Expression {
    constructor(
        public token: Token,
        public value: string,
    ) {}
    tokenLiteral(): string {
        return this.value
    }
    string(): string {
        return this.value
    }
}

export class LetStatement implements Statement {
    constructor(
        public token: Token,
        public name: Identifier,
        // TODO should be an expression
        public value: null,
    ) {}

    tokenLiteral(): string {
        return this.token.literal
    }

    string(): string {
        return `${this.token.literal} ${this.name.value} = `
    }
}

export class ReturnStatement implements Statement {
    constructor(
        public token: Token,
        // TODO should be an expression
        public value: null,
    ) {}

    tokenLiteral(): string {
        return this.token.literal
    }

    string(): string {
        return `return `
    }
}
