import {Lexer} from "./token/lexer";
import {TokenType} from "./token/token";

let l = new Lexer('=+(){},;-/*<>!')
let token = l.nextToken()
let i = 0
while (token.type !== TokenType.EOF) {
    token = l.nextToken()
    i++
}

console.log('done')
