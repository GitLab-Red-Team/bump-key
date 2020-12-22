const { testEnvironment } = require("../../jest.config");

import { readJSON } from './reader'

describe('reader', () => {
    describe('readJSON', () => {
        let json;
        beforeEach(() => {
            json = readJSON(process.cwd() + '/test-data/test.json');
        });
        test('returns a proper json structure', () => {
            expect(json).not.toEqual(undefined);
            expect(json.name).toEqual('bumpkey');
        });
        describe('throws an error if', () => {
            const noPath = 'No path was given!'
            test('undefined path is given', () => {
                expect(() => readJSON(undefined)).toThrow(noPath);
            });
            test('empty string path is given', () => {
                expect(() => readJSON("")).toThrow(noPath);
            });
        });
    });
});