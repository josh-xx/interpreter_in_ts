import {Lexer} from "../lexer";
import {Token, TokenType} from "../token";

describe("test lexer", () => {
    it('tokens1', () => {
        let l = new Lexer('=+(){},;-/*<>!')
        let result: Token[] = [
            new Token(TokenType.Assign, '='),
            new Token(TokenType.Plus, '+'),
            new Token(TokenType.L_Paren, '('),
            new Token(TokenType.R_Paren, ')'),
            new Token(TokenType.L_Brace, '{'),
            new Token(TokenType.R_Brace, '}'),
            new Token(TokenType.Comma, ','),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.Minus, '-'),
            new Token(TokenType.Slash, '/'),
            new Token(TokenType.Asterisk, '*'),
            new Token(TokenType.LessThan, '<'),
            new Token(TokenType.GreaterThan, '>'),
            new Token(TokenType.Bang, '!'),
            new Token(TokenType.EOF, ''),
        ]

        let token = l.nextToken()
        let i = 0
        while (token.type !== TokenType.EOF) {
            expect(token.type).toBe(result[i].type)
            expect(token.literal).toBe(result[i].literal)

            token = l.nextToken()
            i++
        }
        if (token.type === TokenType.EOF) i++

        expect(i).toEqual(result.length)
    })

    it('tokens2', () => {
        let input = `let five = 5;
let ten = 10;
   let add = fn(x, y) {
     x + y;
};
   let result = add(five, ten);
   `
        let l = new Lexer(input)
        let result: Token[] = [
            new Token(TokenType.Let, 'let'),
            new Token(TokenType.Identifier, 'five'),
            new Token(TokenType.Assign, '='),
            new Token(TokenType.Int, '5'),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.Let, 'let'),
            new Token(TokenType.Identifier, 'ten'),
            new Token(TokenType.Assign, '='),
            new Token(TokenType.Int, '10'),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.Let, 'let'),
            new Token(TokenType.Identifier, 'add'),
            new Token(TokenType.Assign, '='),
            new Token(TokenType.Function, 'fn'),
            new Token(TokenType.L_Paren, '('),
            new Token(TokenType.Identifier, 'x'),
            new Token(TokenType.Comma, ','),
            new Token(TokenType.Identifier, 'y'),
            new Token(TokenType.R_Paren, ')'),
            new Token(TokenType.L_Brace, '{'),
            new Token(TokenType.Identifier, 'x'),
            new Token(TokenType.Plus, '+'),
            new Token(TokenType.Identifier, 'y'),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.R_Brace, '}'),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.Let, 'let'),
            new Token(TokenType.Identifier, 'result'),
            new Token(TokenType.Assign, '='),
            new Token(TokenType.Identifier, 'add'),
            new Token(TokenType.L_Paren, '('),
            new Token(TokenType.Identifier, 'five'),
            new Token(TokenType.Comma, ','),
            new Token(TokenType.Identifier, 'ten'),
            new Token(TokenType.R_Paren, ')'),
            new Token(TokenType.Semicolon, ';'),
            new Token(TokenType.EOF, ''),
        ]

        let token = l.nextToken()
        let i = 0
        while (token.type !== TokenType.EOF) {
            expect(token.type).toBe(result[i].type)
            expect(token.literal).toBe(result[i].literal)

            token = l.nextToken()
            i++
        }
        if (token.type === TokenType.EOF) i++

        expect(i).toBe(result.length)
    })
});
