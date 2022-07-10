import {Lexer} from "../../token/lexer";
import {Parser} from "../parser";
import {
    ExpressionStatement,
    Identifier,
    InfixExpression,
    IntLiteral,
    LetStatement,
    PrefixExpression,
    ReturnStatement
} from "../../ast/ast";

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

    it('identifier', function () {
        let input = `
        foobar;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(1)
        let statement = program.statements[0]
        if(!(statement instanceof ExpressionStatement)) throw 'bad statement'
        if(!(statement.expression instanceof Identifier)) throw 'bad expression'
        expect(statement.expression.value).toBe('foobar')
    });

    it('int literal', function () {
        let input = `
        1;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(1)
        let statement = program.statements[0]
        if(!(statement instanceof ExpressionStatement)) throw 'bad statement'
        if(!(statement.expression instanceof IntLiteral)) throw 'bad expression'
        expect(statement.expression.value).toBe(1)
    });

    it('prefix', function () {
        let input = `
        -1;
        !2;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(2)
        let i = 0
        let operators = ['-', '!']
        let types = [Identifier, IntLiteral]
        let rights = ['1', '2']
        for (let statement of program.statements) {
            expect(statement).toBeInstanceOf(ExpressionStatement)
            if(!(statement instanceof ExpressionStatement)) throw 'bad statement'
            let expression = statement.expression
            expect(expression).toBeInstanceOf(PrefixExpression)
            if(!(expression instanceof PrefixExpression)) throw 'bad statement'
            expect(expression.operator).toBe(operators[i])
            expect(expression.right?.string()).toBe(rights[i])
            expect(expression.right).toBeInstanceOf(types[i])

            i++
        }
    });

    it('infix', function () {
        let input = `
5 + 5;
5 - 5;
5 * 5;
5 / 5;
5 > 5;
5 < 5;
5 == 5;
5 != 5;
   `
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)

        let program = parser.parseProgram()

        expect(program.statements.length).toBe(8)
        let i = 0
        let lefts = ['5', '5', '5', '5', '5', '5', '5', '5',]
        let operators = ['+', '-', '*', '/', '>', '<', '==', '!=']
        let rights = ['5', '5', '5', '5', '5', '5', '5', '5',]
        for (let statement of program.statements) {
            expect(statement).toBeInstanceOf(ExpressionStatement)
            if(!(statement instanceof ExpressionStatement)) throw 'bad statement'
            let expression = statement.expression
            expect(expression).toBeInstanceOf(InfixExpression)
            if(!(expression instanceof InfixExpression)) throw 'bad statement'
            expect(expression.left?.string()).toBe(lefts[i])
            expect(expression.operator).toBe(operators[i])
            expect(expression.right?.string()).toBe(rights[i])

            i++
        }
    });

});
