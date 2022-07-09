import {Lexer} from "../../token/lexer";
import {Parser} from "../parser";
import {LetStatement, ReturnStatement} from "../../ast/ast";

describe('parser', function () {
    it('let', function () {
        let input = `
   let x = 5;
   let y = 10;
   let foobar = 838383;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(3)

        let names = ['x', 'y', 'foobar']
        let strings = ['let x = ', 'let y = ', 'let foobar = ']
        let i = 0
        for (let statement of program.statements) {
            expect(statement instanceof LetStatement).toBe(true)
            if(!(statement instanceof LetStatement)) throw 'bad statement'
            expect(statement.name.value).toBe(names[i])
            expect(statement.string()).toBe(strings[i])

            i++
        }
    });

    it('return', function () {
        let input = `
   return 5;
   return 10;
   return 838383;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(3)

        let strings = ['return ', 'return ', 'return ']
        let i = 0
        for (let statement of program.statements) {
            expect(statement instanceof ReturnStatement).toBe(true)
            if(!(statement instanceof ReturnStatement)) throw 'bad statement'
            expect(statement.string()).toBe(strings[i])

            i++
        }
    });

});
