import {Lexer} from "../token/lexer";
import {Token, TokenType} from "../token/token";
import {
    BlockStatement,
    BooleanLiteral,
    Expression,
    ExpressionStatement,
    FunctionLiteral,
    Identifier,
    IfExpression,
    InfixExpression,
    IntLiteral,
    LetStatement,
    PrefixExpression,
    Program,
    ReturnStatement
} from "../ast/ast";

type PrefixParseFn = () => Expression
type InfixParseFn = (expression: Expression) => Expression

export enum PrecedenceOrder {
    Lowest,
    Equal,
    LessGreater,
    Sum,
    Product,
    Prefix,
}

export const PrecedenceMap: Partial<Record<TokenType, PrecedenceOrder>> = {
    [TokenType.Eq]: PrecedenceOrder.Equal,
    [TokenType.Not_Eq]: PrecedenceOrder.Equal,
    [TokenType.LessThan]: PrecedenceOrder.LessGreater,
    [TokenType.GreaterThan]: PrecedenceOrder.LessGreater,
    [TokenType.Plus]: PrecedenceOrder.Sum,
    [TokenType.Minus]: PrecedenceOrder.Sum,
    [TokenType.Asterisk]: PrecedenceOrder.Product,
    [TokenType.Slash]: PrecedenceOrder.Product,
}

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
        this.addPrefixFn(TokenType.True, this.parseBooleanLiteral)
        this.addPrefixFn(TokenType.False, this.parseBooleanLiteral)
        this.addPrefixFn(TokenType.L_Paren, this.parseGroupedExpression)
        this.addPrefixFn(TokenType.If, this.parseIfExpression)
        this.addPrefixFn(TokenType.Function, this.parseFunctionLiteral)

        this.addInfixFn(TokenType.Asterisk, this.parseInfixExpression)
        this.addInfixFn(TokenType.Slash, this.parseInfixExpression)
        this.addInfixFn(TokenType.Plus, this.parseInfixExpression)
        this.addInfixFn(TokenType.Minus, this.parseInfixExpression)
        this.addInfixFn(TokenType.Eq, this.parseInfixExpression)
        this.addInfixFn(TokenType.Not_Eq, this.parseInfixExpression)
        this.addInfixFn(TokenType.LessThan, this.parseInfixExpression)
        this.addInfixFn(TokenType.GreaterThan, this.parseInfixExpression)
    }

    parseInfixExpression = (left: Expression) => {
        let token = this.currentToken
        let precedence = this.currentPrecedence()
        this.nextToken()
        let right = this.parseExpression(precedence)

        return new InfixExpression(token, token.literal, left, right)
    }

    parseGroupedExpression = () => {
        this.nextToken()
        let expression = this.parseExpression(PrecedenceOrder.Lowest)

        if (!this.nextTokenIfPeekIs(TokenType.R_Paren)) {
            console.error('parse grouped expression paren not match')
            return expression
        }

        return expression
    }

    parseIdentifier = () => {
        return new Identifier(this.currentToken, this.currentToken.literal)
    }

    parseIntLiteral = () => {
        return new IntLiteral(this.currentToken, Number(this.currentToken.literal))
    }

    parseBooleanLiteral = () => {
        return new BooleanLiteral(this.currentToken, JSON.parse(this.currentToken.literal))
    }

    parsePrefixExpression = () => {
        let token = this.currentToken
        let operator = this.currentToken.literal
        this.nextToken()
        let expression = this.parseExpression(PrecedenceOrder.Prefix)
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

    parseBlockStatement() {
        let token = this.currentToken
        this.nextToken()

        let statements = []
        while (!this.currentTokenIs(TokenType.R_Brace) && !this.currentTokenIs(TokenType.EOF)) {
            statements.push(this.parseStatement())
            this.nextToken()
        }

        return new BlockStatement(token, statements)
    }

    parseIfExpression = () => {
        let token = this.currentToken
        if (!this.nextTokenIfPeekIs(TokenType.L_Paren)) {
            throw ''
        }
        this.nextToken()
        let condition = this.parseExpression(PrecedenceOrder.Lowest)
        if (!this.nextTokenIfPeekIs(TokenType.R_Paren)) {
            throw ''
        }
        if (!this.nextTokenIfPeekIs(TokenType.L_Brace)) {
            throw ''
        }
        let consequences = this.parseBlockStatement()
        // current -> }
        let alternatives = null
        if (this.peekTokenIs(TokenType.Else)) {
            this.nextToken()

            if (!this.nextTokenIfPeekIs(TokenType.L_Brace)) {
                throw ''
            }

            alternatives = this.parseBlockStatement()
        }
        // } left

        return new IfExpression(token, condition, consequences, alternatives)
    }

    parseFunctionParameters() {
        let identifiers: Identifier[] = []
        // empty
        if (this.peekTokenIs(TokenType.R_Paren)) {
            this.nextToken()
            return identifiers
        }
        this.nextToken() // first identifier
        identifiers.push(new Identifier(this.currentToken, this.currentToken.literal))

        while (this.peekTokenIs(TokenType.Comma)) {
            this.nextToken() // ,
            this.nextToken() // identifier
            identifiers.push(new Identifier(this.currentToken, this.currentToken.literal))
        }

        if (!this.nextTokenIfPeekIs(TokenType.R_Paren)) {
            throw ''
        }

        return identifiers
    }

    parseFunctionLiteral = () => {
        let token = this.currentToken

        if (!this.nextTokenIfPeekIs(TokenType.L_Paren)) {
            throw ''
        }

        let parameters = this.parseFunctionParameters()

        if (!this.nextTokenIfPeekIs(TokenType.L_Brace)) {
            throw ''
        }

        let body = this.parseBlockStatement()

        return new FunctionLiteral(token, parameters, body)
    }

    parseExpression(precedence: PrecedenceOrder) {
        let prefix = this.prefixParseFnMap[this.currentToken.type]
        if (!prefix) {
            throw `no prefix for ${this.currentToken.type} is defined`
        }
        let leftExp = prefix()
        // 从 lowest 开始左结合
        while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
            // 不停右结合
            let infix = this.infixParseFnMap[this.peekToken.type]
            if (!infix) {
                console.error('no infix for', this.currentToken.type, 'is defined', precedence, this.peekPrecedence(), this.currentToken, this.peekToken)
                throw 'error'
            }
            this.nextToken()

            leftExp = infix(leftExp)
        }
        return leftExp
    }

    parseExpressionStatement() {
        let expression = this.parseExpression(PrecedenceOrder.Lowest)
        if (!expression) return null
        let s = new ExpressionStatement(this.currentToken, expression)
        while (this.peekTokenIs(TokenType.Semicolon)) this.nextToken()
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

        this.nextToken()
        let expression = this.parseExpression(PrecedenceOrder.Lowest)
        if (expression === null) {
            console.error('expression parse error')
        }

        if (!this.peekTokenIs(TokenType.Semicolon)) {
            console.error('error content', this.currentToken, this.peekToken)
            while (this.peekTokenIs(TokenType.Semicolon)) this.nextToken()
        } else {
            this.nextToken()
        }

        return new LetStatement(letToken, identifier, expression)
    }

    parseReturnStatement() {
        // let a = 1
        let returnToken = this.currentToken

        this.nextToken()
        let expression = this.parseExpression(PrecedenceOrder.Lowest)
        if (expression === null) {
            console.error('expression parse error')
        }

        if (!this.peekTokenIs(TokenType.Semicolon)) {
            console.error('error content', this.currentToken, this.peekToken)
            while (this.peekTokenIs(TokenType.Semicolon)) this.nextToken()
        } else {
            this.nextToken()
        }

        return new ReturnStatement(returnToken, expression)
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

    currentPrecedence(): PrecedenceOrder {
        let p = PrecedenceMap[this.currentToken.type]
        if (p === undefined) {
            return PrecedenceOrder.Lowest
        }
        return p
    }

    peekPrecedence(): PrecedenceOrder {
        let p = PrecedenceMap[this.peekToken.type]
        if (p === undefined) {
            return PrecedenceOrder.Lowest
        }
        return p
    }
}
