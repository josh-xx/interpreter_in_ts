import {Token, TokenType} from "./token";

export class Lexer {
    constructor(
        public input: string,
        public position: number = 0,
    ) {}

    nextChar() {
        return this.input[++this.position]
    }

    currentChar() {
        return this.input[this.position]
    }

    isWhitespace(c: string) {
        return [' ', '\n'].includes(c)
    }

    isAlphabet(c: string) {
        let ch = c
        return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch == '_'
    }

    isDigit(c: string) {
        let ch = c
        return '0' <= ch && ch <= '9'
    }

    skipWhitespaces() {
        if (!this.isWhitespace(this.currentChar())) return
        while (this.isWhitespace(this.nextChar())) {}
    }

    readWord() {
        let word = '' + this.currentChar()
        let c = this.nextChar()
        while (this.isAlphabet(c)) {
            word += c

            c = this.nextChar()
        }

        if (word === 'fn') {
            return new Token(TokenType.Function, word)
        } else if (word === 'let') {
            return new Token(TokenType.Let, word)
        } else {
            return new Token(TokenType.Identifier, word)
        }
    }

    readNumber() {
        let word = '' + this.currentChar()
        let c = this.nextChar()
        while (this.isDigit(c)) {
            word += c

            c = this.nextChar()
        }

        return new Token(TokenType.Int, word)
    }

    nextToken(): Token {
        this.skipWhitespaces()
        let c = this.currentChar()

        if (c === undefined) {
            return new Token(TokenType.EOF, '')
        }

        let token: Token
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
        } else if (c === '-') {
            token = new Token(TokenType.Minus, c)
        } else if (c === '-') {
            token = new Token(TokenType.Minus, c)
        } else if (c === '/') {
            token = new Token(TokenType.Slash, c)
        } else if (c === '*') {
            token = new Token(TokenType.Asterisk, c)
        } else if (c === '<') {
            token = new Token(TokenType.LessThan, c)
        } else if (c === '>') {
            token = new Token(TokenType.GreaterThan, c)
        } else if (c === '!') {
            token = new Token(TokenType.BANG, c)
        } else {
            if (this.isAlphabet(c)) {
                return this.readWord()
            } else if (this.isDigit(c)) {
                return this.readNumber()
            }

            throw `unsupported token ${c}`
        }

        this.nextChar()
        return token
    }
}
