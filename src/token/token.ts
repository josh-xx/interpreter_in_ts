export enum TokenType {
    Illegal = "illegal",
    EOF = "EOF",
    Identifier = "identifier",
    Int = "int",
    Assign = "=",
    Plus = "+",
    Comma = ",",
    Semicolon = ";",
    L_Paren = "(",
    R_Paren = ")",
    L_Brace = "{",
    R_Brace = "}",
    Function = "function",
    Var = "var"
}

export class Token {
    constructor(
        public type: TokenType,
        public literal: string,
    ) {}
}

class TokenList {
    constructor(
        public tokens: Token[] = [],
        public current: number = -1,
    ) {}

    nextToken() {
        this.current += 1
        return this.tokens[this.current]
    }
}
