import {Lexer} from "./token/lexer";
import {Parser} from "./parser/parser";

// let input = `
// 5 + 5;
// 5 - 5;
// 5 * 5;
// 5 / 5;
// 5 > 5;
// 5 < 5;
// 5 == 5;
// 5 != 5;
//    `
let input = `
1 + 2 + 3;
   `

let lexer = new Lexer(input)
let parser = new Parser(lexer)

let program = parser.parseProgram()

console.log('done')
