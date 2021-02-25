import * as dependencies from './index';

describe('dependencies', () => {
    let outdated;
    let options = {
        cwd: process.cwd() + '/test-data/'
    }
    beforeEach(async () => {
        outdated = await dependencies.recon(options)
            .then((result) => outdated = result)
            .catch((e) => {throw e});
    });
    test('returns the proper production dependencies', () => {
        expect.assertions(2);
        outdated.forEach((x) => {
            console.log(x);
            expect(x).not.toEqual(undefined);
        });
    });
});