import {Token, TokenType} from "../token/token";

interface AstNode {
    tokenLiteral(): string
    string(): string
}

export interface Statement extends AstNode {
}

export interface Expression extends AstNode {
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
        return this.token.literal
    }
    string(): string {
        return this.value
    }
}

export class IntLiteral implements Expression {
    constructor(
        public token: Token,
        public value: number,
    ) {}
    tokenLiteral(): string {
        return this.token.literal
    }
    string(): string {
        return String(this.value)
    }
}

export class BooleanLiteral implements Expression {
    constructor(
        public token: Token,
        public value: boolean,
    ) {}
    tokenLiteral(): string {
        return this.token.literal
    }
    string(): string {
        return String(this.value)
    }
}

export class PrefixExpression implements Expression {
    constructor(
        public token: Token,
        public operator: string,
        public right: Expression | null,
    ) {}
    tokenLiteral(): string {
        return this.token.literal
    }
    string(): string {
        return `(${this.operator}${this.right?.string() || ''})`
    }
}

export class InfixExpression implements Expression {
    constructor(
        public token: Token,
        public operator: string,
        public left: Expression | null,
        public right: Expression | null,
    ) {}
    tokenLiteral(): string {
        return this.token.literal
    }
    string(): string {
        return `(${this.left?.string() || ''} ${this.operator} ${this.right?.string() || ''})`
    }
}

export class LetStatement implements Statement {
    constructor(
        public token: Token,
        public name: Identifier,
        public value: Expression | null,
    ) {}

    tokenLiteral(): string {
        return this.token.literal
    }

    string(): string {
        return `${this.token.literal} ${this.name.value} = ${this.value?.string() || ''}`
    }
}

export class ReturnStatement implements Statement {
    constructor(
        public token: Token,
        public value: Expression | null,
    ) {}

    tokenLiteral(): string {
        return this.token.literal
    }

    string(): string {
        return `return ${this.value?.string() || ''}`
    }
}

export class ExpressionStatement implements Statement {
    constructor(
        public token: Token,
        public expression: Expression,
    ) {}

    tokenLiteral(): string {
        return this.token.literal
    }

    string(): string {
        return this.expression.string()
    }
}

