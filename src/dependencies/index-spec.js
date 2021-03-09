import dependencies from './index.js';

import sinon from 'sinon'
import { expect } from 'chai';

import npmCheck from 'npm-check';

describe('dependencies recon', () => {
    let deps, checkerStub, fakePackages;
    let options = {
        cwd: process.cwd()
    };
    beforeEach(async () => {
        fakePackages = [{
            moduleName: 'lodash',                 // name of the module.
            homepage: 'https://lodash.com/',      // url to the home page.
            regError: undefined,                  // error communicating with the registry
            pkgError: undefined,                  // error reading the package.json
            latest: '4.7.0',                      // latest according to the registry.
            installed: '4.6.1',                   // version installed
            isInstalled: true,                    // Is it installed?
            notInstalled: false,                  // Is it installed?
            packageWanted: '4.7.0',               // Requested version from the package.json.
            packageJson: '^4.6.1',                // Version or range requested in the parent package.json.
            devDependency: false,                 // Is this a devDependency?
            usedInScripts: undefined,             // Array of `scripts` in package.json that use this module.
            mismatch: false,                      // Does the version installed not match the range in package.json?
            semverValid: '4.6.1',                 // Is the installed version valid semver?
            easyUpgrade: true,                    // Will running just `npm install` upgrade the module?
            bump: 'minor',                        // What kind of bump is required to get the latest, such as patch, minor, major.
            unused: false                         // Is this module used in the code?
        }];
        const currentStateSpy = {
            get: sinon.stub().returns(fakePackages),
        };
        checkerStub = sinon.stub().resolves(currentStateSpy);
        deps = await dependencies.recon(options, checkerStub)
            .then((result) => result)
            .catch((e) => {throw e});
    });
    afterEach(() => {
        deps = null;
        checkerStub = null;
        fakePackages = null;
    });
    it('returns the proper production dependencies', () => {
        deps.forEach((dep) => {
            expect(dep).not.to.eql(undefined);
        });
    });
    it('returns valid dependency object', () => {
        expect(Object.entries(deps[0]).length).to.eql(7);
        expect(deps[0].moduleName).to.eql(fakePackages[0].moduleName);
        expect(deps[0].homepage).to.eql(fakePackages[0].homepage);
        expect(deps[0].latest).to.eql(fakePackages[0].latest);
        expect(deps[0].installed).to.eql(fakePackages[0].installed);
        expect(deps[0].packageWanted).to.eql(fakePackages[0].packageWanted);
        expect(deps[0].bump).to.eql(fakePackages[0].bump);
        expect(deps[0].usedInScripts).to.eql(fakePackages[0].usedInScripts);
    });
});