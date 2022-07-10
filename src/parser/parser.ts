import {Lexer} from "../token/lexer";
import {Token, TokenType} from "../token/token";
import {
    Expression,
    ExpressionStatement,
    Identifier,
    IntLiteral,
    LetStatement, PrefixExpression,
    Program,
    ReturnStatement
} from "../ast/ast";

type PrefixParseFn = () => Expression
type InfixParseFn = (expression: Expression) => Expression

export class Parser {
    public currentToken: Token
    public peekToken: Token
    public errors: string[] = []

    public prefixParseFnMap: Partial<Record<TokenType, PrefixParseFn>> = {}
    public infixParseFnMap: Partial<Record<TokenType, InfixParseFn>> = {}

    constructor(
        public lexer: Lexer,
    ) {
        let t1 = this.lexer.nextToken()
        let t2 = this.lexer.nextToken()

        this.currentToken = t1
        this.peekToken = t2

        this.addPrefixFn(TokenType.Identifier, this.parseIdentifier)
        this.addPrefixFn(TokenType.Int, this.parseIntLiteral)
        this.addPrefixFn(TokenType.Minus, this.parsePrefixExpression)
        this.addPrefixFn(TokenType.Bang, this.parsePrefixExpression)
    }

    parseIdentifier = () => {
        return new Identifier(this.currentToken, this.currentToken.literal)
    }

    parseIntLiteral = () => {
        return new IntLiteral(this.currentToken, Number(this.currentToken.literal))
    }

    parsePrefixExpression = () => {
        let token = this.currentToken
        let operator = this.currentToken.literal
        this.nextToken()
        let expression = this.parseExpression()
        if (expression === null) {
            console.error('parse expression error')
        }
        return new PrefixExpression(token, operator, expression)
    }

    addPrefixFn(type: TokenType, fn: PrefixParseFn) {
        this.prefixParseFnMap[type] = fn
    }

    addInfixFn(type: TokenType, fn: InfixParseFn) {
        this.infixParseFnMap[type] = fn
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

    parseExpression() {
        let prefix = this.prefixParseFnMap[this.currentToken.type]
        if (!prefix) {
            console.log('no prefix for', this.currentToken.type, 'is defined')
            return null
        }
        let leftExp = prefix()
        return leftExp
    }

    parseExpressionStatement() {
        let expression = this.parseExpression()
        if (!expression) return null
        let s = new ExpressionStatement(this.currentToken, expression)
        while (!this.currentTokenIs(TokenType.Semicolon)) this.nextToken()
        return s
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
            return this.parseExpressionStatement()
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
