import {Lexer} from "../../token/lexer";
import {Parser} from "../../parser/parser";
import {evaluate} from "../evaluator";
import {ObjectBase, ObjectBoolean, ObjectInteger, ObjectNull} from "../../object/object";

describe('evaluator', function () {
    const testEval = (input: string) => {
        let lexer = new Lexer(input)
        let parser = new Parser(lexer)
        let program = parser.parseProgram()

        return evaluate(program)
    }

    const testObjectInteger = (obj: ObjectBase, expected: number) => {
        expect(obj).toBeInstanceOf(ObjectInteger)
        if (!(obj instanceof ObjectInteger)) throw 'bad statement'

        expect(obj.value).toBe(expected)
    }

    const testObjectBoolean = (obj: ObjectBase, expected: boolean) => {
        expect(obj).toBeInstanceOf(ObjectBoolean)
        if (!(obj instanceof ObjectBoolean)) throw 'bad statement'

        expect(obj.value).toBe(expected)
    }

    const testBangOperator = (obj: ObjectBase, expected: boolean) => {
        expect(obj).toBeInstanceOf(ObjectBoolean)
        if (!(obj instanceof ObjectBoolean)) throw 'bad statement'

        expect(obj.value).toBe(expected)
    }

    it('integer', function () {
        let tests: [string, number][] = [
            ["5", 5],
            ["10", 10],
            ["-5", -5],
            ["-10", -10],
            ["5 + 5 + 5 + 5 - 10", 10],
            ["2 * 2 * 2 * 2 * 2", 32],
            ["-50 + 100 + -50", 0],
            ["5 * 2 + 10", 20],
            ["5 + 2 * 10", 25],
            ["20 + 2 * -10", 0],
            ["50 / 2 * 2 + 10", 60],
            ["2 * (5 + 10)", 30],
            ["3 * 3 * 3 + 10", 37],
            ["3 * (3 * 3) + 10", 37],
            ["(5 + 10 * 2 + 15 / 3) * 2 + -10", 50],
        ]
        for (let test of tests) {
            let [input, expected] = test
            let e = testEval(input)
            testObjectInteger(e, expected)
        }
    });

    it('boolean', function () {
        let tests: [string, boolean][] = [
            ["true", true],
            ["false", false],
            ["1 < 2", true],
            ["1 > 2", false],
            ["1 < 1", false],
            ["1 > 1", false],
            ["1 == 1", true],
            ["1 != 1", false],
            ["1 == 2", false],
            ["1 != 2", true],
            ["true == true", true],
            ["false == false", true],
            ["true == false", false],
            ["true != false", true],
            ["false != true", true],
            ["(1 < 2) == true", true],
            ["(1 < 2) == false", false],
            ["(1 > 2) == true", false],
            ["(1 > 2) == false", true],
        ]
        for (let test of tests) {
            let [input, expected] = test
            let e = testEval(input)
            testObjectBoolean(e, expected)
        }
    });

    it('null', function () {
        expect(testEval('null')).toBeInstanceOf(ObjectNull)
    });

    it('bang', function () {
        let tests: [string, boolean][] = [
            ["!true", false],
            ["!false", true],
            ["!5", false],
            ["!!true", true],
            ["!!false", false],
            ["!!5", true],
        ]
        for (let test of tests) {
            let [input, expected] = test
            let e = testEval(input)
            testBangOperator(e, expected)
        }
    });

    it('if', function () {
        let tests: [string, any][] = [
            ["if (true) { 10 }", 10],
            ["if (false) { 10 }", null],
            ["if (1) { 10 }", 10],
            ["if (1 < 2) { 10 }", 10],
            ["if (1 > 2) { 10 }", null],
            ["if (1 > 2) { 10 } else { 20 }", 20],
            ["if (1 < 2) { 10 } else { 20 }", 10],
        ]
        for (let test of tests) {
            let [input, expected] = test
            let e = testEval(input)

            if (e instanceof ObjectInteger) {
                testObjectInteger(e, expected)
            } else if (e instanceof ObjectNull) {
                expect(expected).toBe(null)
            }
        }
    });

});
