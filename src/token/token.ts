export enum TokenType {
    Illegal = "illegal",
    EOF = "EOF",
    Identifier = "identifier",
    Int = "int",
    Assign = "=",
    Plus = "+",
    Minus = "-",
    Slash = "/",
    Bang = "!",
    Asterisk = "*",
    LessThan = "<",
    GreaterThan = ">",
    Comma = ",",
    Semicolon = ";",
    L_Paren = "(",
    R_Paren = ")",
    L_Brace = "{",
    R_Brace = "}",
    Function = "fn",
    Let = "let",
    True = 'true',
    False = 'false',
    If = 'if',
    Else = 'else',
    Return = 'return',
    Eq = '==',
    Not_Eq = '!=',
}

export class Token {
    constructor(
        public type: TokenType,
        public literal: string,
    ) {}
}
