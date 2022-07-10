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

let input1 = ['1 + (2 + 3) + 4', "((1 + (2 + 3)) + 4)"]
let lexer = new Lexer(input1[0])
let parser = new Parser(lexer)
console.log('start')

let program = parser.parseProgram()

console.log('done')
