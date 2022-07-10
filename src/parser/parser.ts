import {Lexer} from "../token/lexer";
import {Token, TokenType} from "../token/token";
import {Identifier, LetStatement, Program, ReturnStatement, Statement} from "../ast/ast";

export class Parser {
    public currentToken: Token
    public peekToken: Token
    public errors: string[] = []

    constructor(
        public lexer: Lexer,
    ) {
        let t1 = this.lexer.nextToken()
        let t2 = this.lexer.nextToken()
        this.currentToken = t1
        this.peekToken = t2
    }

    onNextTokenIllegalError(token: TokenType) {
        let msg = `expected next token to be ${token}, got ${this.peekToken.type} instead`
        this.errors.push(msg)
    }

    nextToken() {
        this.currentToken = this.peekToken
        this.peekToken = this.lexer.nextToken()
    }

    parseLetStatement() {
        // let a = 1
        let letToken = this.currentToken
        if (!this.nextTokenIfPeekIs(TokenType.Identifier)) {
            return null
        }
        let name = new Identifier(this.currentToken, this.currentToken.literal)

        if (!this.nextTokenIfPeekIs(TokenType.Assign)) {
            return null
        }

        // TODO
        // skip to ;
        while (!this.currentTokenIs(TokenType.Semicolon)) {
            this.nextToken()
        }

        return new LetStatement(letToken, name, null)
    }

    parseReturnStatement() {
        // let a = 1
        let returnToken = this.currentToken
        // TODO
        // skip to ;
        while (!this.currentTokenIs(TokenType.Semicolon)) {
            this.nextToken()
        }

        return new ReturnStatement(returnToken, null)
    }

    parseStatement() {
        if (this.currentTokenIs(TokenType.Let)) {
            return this.parseLetStatement() }
        else if (this.currentTokenIs(TokenType.Return)) {
            return this.parseReturnStatement()
        } else {
            return null
        }
    }

    parseProgram() {
        let program = new Program()

        while (this.currentToken.type !== TokenType.EOF) {
            let statement: Statement | null = this.parseStatement()
            if (statement !== null) {
                program.statements.push(statement)
            }

            this.nextToken()
        }

        return program
    }

    currentTokenIs(type: TokenType) {
        return this.currentToken.type === type
    }

    peekTokenIs(type: TokenType) {
        return this.peekToken.type === type
    }

    nextTokenIfPeekIs(type: TokenType) {
        if (this.peekTokenIs(type)) {
            this.nextToken()
            return true
        } else {
            this.onNextTokenIllegalError(type)
            return false
        }
    }
}

