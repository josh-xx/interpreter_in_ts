import {Lexer} from "../../token/lexer";
import {Parser} from "../parser";
import {LetStatement} from "../../ast/ast";

const checkParserErrors = (p: Parser) => {
    let errors = p.errors
    if (errors.length == 0) {
        return false
    }

    console.error(`parser has %d errors ${errors.length}`)
    errors.forEach(error => console.error(`parser error: ${error}`))
    return true
}

describe('test parser', () => {
    it('let', () => {
        let input = `
        let x = 5;
        let a y = 10;
        let foobar = 838383;
        `

        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(checkParserErrors(parser)).toBe(false)

        expect(program.statements.length).toBe(3)

        let names = ['x', 'y', 'foobar']
        let i = 0
        for (let statement of program.statements) {
            expect(statement instanceof LetStatement).toBe(true)
            if (!(statement instanceof LetStatement)) throw ''

            expect(statement.name.value).toBe(names[i])
            i++
        }
    })
})
