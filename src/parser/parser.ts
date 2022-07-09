import {Lexer} from "../token/lexer";
import {Token, TokenType} from "../token/token";
import {Identifier, LetStatement, Program, ReturnStatement} from "../ast/ast";

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

    nextToken() {
        this.currentToken = this.peekToken
        this.peekToken = this.lexer.nextToken()
    }

    currentTokenIs(type: TokenType) {
        return this.currentToken.type === type
    }

    peekTokenIs(type: TokenType) {
        return this.peekToken.type === type
    }

    onIllegalPeekTokenError(type: TokenType) {
        let msg = `"expected next token to be ${type}, got ${this.peekToken.type} instead"`
        this.errors.push(msg)
    }

    nextTokenIfPeekIs(type: TokenType) {
        if (this.peekToken.type === type) {
            this.nextToken()
            return true
        } else {
            this.onIllegalPeekTokenError(type)
            return false
        }
    }

    parseLetStatement() {
        // let a = 1
        let letToken = this.currentToken

        if (!this.nextTokenIfPeekIs(TokenType.Identifier)) {
            this.onIllegalPeekTokenError(TokenType.Identifier)
            return null
        }
        let identifier = new Identifier(this.currentToken, this.currentToken.literal)

        if (!this.nextTokenIfPeekIs(TokenType.Assign)) {
            this.onIllegalPeekTokenError(TokenType.Assign)
            return null
        }

        while (this.peekTokenIs(TokenType.Semicolon)) this.nextToken()

        return new LetStatement(letToken, identifier, null)
    }

    parseReturnStatement() {
        // let a = 1
        let returnToken = this.currentToken

        while (this.peekTokenIs(TokenType.Semicolon)) this.nextToken()

        return new ReturnStatement(returnToken, null)
    }

    parseStatement() {
        if (this.currentTokenIs(TokenType.Let)) {
            return this.parseLetStatement()
        } else if (this.currentTokenIs(TokenType.Return)) {
            return this.parseReturnStatement()
        } else {
            return null
        }
    }

    parseProgram() {
        let program = new Program()

        while (!this.currentTokenIs(TokenType.EOF)) {
            let statement = this.parseStatement()
            if (statement !== null) {
                program.statements.push(statement)
            }

            this.nextToken()
        }

        return program
    }
}
