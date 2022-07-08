import {Token, TokenType} from "./token";

export class Lexer {
    constructor(
        public input: string,
        public position: number = -1,
    ) {}

    nextChar() {
        return this.input[this.position++]
    }

    nextToken() {
        let c = this.nextChar()

        let token
        if (c === '+') {
            token = new Token(TokenType.Plus, c)
        } else if (c === '=') {
            token = new Token(TokenType.Assign, c)
        } else if (c === ',') {
            token = new Token(TokenType.Comma, c)
        } else if (c === ';') {
            token = new Token(TokenType.Semicolon, c)
        } else if (c === '(') {
            token = new Token(TokenType.L_Paren, c)
        } else if (c === ')') {
            token = new Token(TokenType.R_Paren, c)
        } else if (c === '{') {
            token = new Token(TokenType.L_Brace, c)
        } else if (c === '}') {
            token = new Token(TokenType.R_Brace, c)
        }

        return token
    }
}
