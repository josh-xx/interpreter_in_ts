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
        if (!(obj instanceof ObjectInteger)) throw 'bad statement'
        expect(obj).toBeInstanceOf(ObjectInteger)

        expect(obj.value).toBe(expected)
    }

    const testObjectBoolean = (obj: ObjectBase, expected: boolean) => {
        if (!(obj instanceof ObjectBoolean)) throw 'bad statement'
        expect(obj).toBeInstanceOf(ObjectBoolean)

        expect(obj.value).toBe(expected)
    }

    it('integer', function () {
        let tests: [string, number][] = [
            ["5", 5],
            ["10", 10],
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

});
