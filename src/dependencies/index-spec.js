import * as dependencies from './index';
import * as constants from '../constants';

describe('dependencies recon', () => {
    let deps;
    let options = {
        cwd: process.cwd() + '/test-data/'
    };
    beforeEach(async () => {
        deps = await dependencies.recon(options)
            .then((result) => result)
            .catch((e) => {throw e});
    });
    test('returns the proper production dependencies', () => {
        expect.assertions(2);
        deps.forEach((dep) => {
            expect(dep).not.toEqual(undefined);
        });
    });
    test('returns valid cowsay dependency object', () => {
        expect(Object.entries(deps[0]).length).toBe(7);
        expect(deps[0].moduleName).toBe('cowsay');
        expect(deps[0].homepage).toBe('https://github.com/piuccio/cowsay');
        expect(deps[0].latest).not.toBe(undefined);
        expect(deps[0].installed).toBe('1.4.0');
        expect(deps[0].packageWanted).toBe('1.4.0');
        expect(constants.BUMP).toContain(deps[0].bump);
        expect(deps[0].usedInScripts).toBe(undefined);
    });
    test('returns valid mocha dependency object', () => {
        expect(Object.entries(deps[1]).length).toBe(7);
        expect(deps[1].moduleName).toBe('mocha');
        expect(deps[1].homepage).toBe('https://mochajs.org/');
        expect(deps[1].latest).not.toBe(undefined);
        expect(deps[1].installed).toBe('8.1.2');
        expect(deps[1].packageWanted).toBe('8.3.1');
        expect(constants.BUMP).toContain(deps[1].bump);
        expect(deps[1].usedInScripts).toBe('test');
    });
});