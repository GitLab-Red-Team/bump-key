import { readJSON } from './reader'

describe('reader', () => {
    describe('readJSON', () => {
        let json;
        beforeEach(async () => {
            await readJSON(process.cwd() + '/test-data/test.json')
                .then((data) => json = data)
                .catch(err => console.log(err));
        });
        test('returns a proper json structure', () => {
            expect(json).not.toEqual(undefined);
            expect(json.name).toEqual('bumpkey');
        });
        describe('throws an error if', () => {
            const noPath = 'No path was given!'
            test('undefined path is given', () => {
                expect(async () => await readJSON()).rejects.toEqual(noPath);
            });
            test('empty string path is given', () => {
                expect(async () => await readJSON("")).rejects.toEqual(noPath);
            });
        });
    });
});