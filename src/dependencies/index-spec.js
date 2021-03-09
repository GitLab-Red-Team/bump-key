import * as dependencies from './index';
import * as constants from '../constants';

describe('dependencies recon', () => {
    let deps;
    let options = {
        cwd: process.cwd()
    };
    beforeEach(async () => {
        deps = await dependencies.recon(options)
            .then((result) => result)
            .catch((e) => {throw e});
    });
    test('returns the proper production dependencies', () => {
        deps.forEach((dep) => {
            expect(dep).not.toEqual(undefined);
        });
    });
    test('returns valid dependency object', () => {
        expect(Object.entries(deps[0]).length).toBe(7);
        expect(deps[0].moduleName).toBe('chalk');
        expect(deps[0].homepage).toBe('https://github.com/chalk/chalk#readme');
    });
});