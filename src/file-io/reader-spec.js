import { readPackageJSON } from './reader'

describe('reader', () => {
    describe('readPackageJSON', () => {
        let json;
        beforeEach(async () => {
            await readPackageJSON(process.cwd() + '/test-data/test.json')
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
                expect(async () => await readPackageJSON()).rejects.toEqual(noPath);
            });
            test('empty string path is given', () => {
                expect(async () => await readPackageJSON("")).rejects.toEqual(noPath);
            });
        });
    });
});