import dependencies from './index.js';

import { expect } from 'chai';

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
    it('returns the proper production dependencies', () => {
        deps.forEach((dep) => {
            expect(dep).not.to.eql(undefined);
        });
    });
    it('returns valid dependency object', () => {
        expect(Object.entries(deps[0]).length).to.eql(7);
        expect(deps[0].moduleName).to.eql('chalk');
        expect(deps[0].homepage).to.eql('https://github.com/chalk/chalk#readme');
    });
});