import { readPackageJSON } from './reader'
import path from 'path';


describe('reader', () => {
    describe('readPackageJSON', () => {
        let json;
        beforeEach(async () => {
            let root = path.join(process.cwd(), '/test-data/');
            await readPackageJSON(root)
                .then((data) => json = data)
                .catch(err => console.log(err));
        });
        test('returns a proper json structure', () => {
            expect(json.name).toEqual('bumpkey-test-data');
        });
        describe('throws an error if', () => {
            const noPath = 'No path given!';
            test('undefined path is given', () => {
                expect(async () => await readPackageJSON()).rejects.toEqual(noPath);
            });
            test('empty string path is given', () => {
                expect(async () => await readPackageJSON('')).rejects.toEqual(noPath);
            });
            test('an invalid path is given', () => {
                expect(async () => await readPackageJSON(path.join(process.cwd(), 'invalid-dir')))
                    .rejects.toContain('No package.json found at');
            });
        });
    });
});