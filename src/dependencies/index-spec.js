import dependencies from './index.js';

import sinon from 'sinon'
import {expect} from 'chai';

import npmCheck from 'npm-check';

describe('dependencies recon', () => {
    let deps, checkerStub, fakePackages;
    let options = {
        cwd: process.cwd()
    };
    beforeEach(async () => {
        fakePackages = [
            {
                moduleName: 'lodash',                 // name of the module.
                homepage: 'https://lodash.com/',      // url to the home page.
                regError: undefined,                  // error communicating with the registry
                pkgError: undefined,                  // error reading the package.json
                latest: '4.7.0',                      // latest according to the registry.
                installed: '4.5.1',                   // version installed
                isInstalled: true,                    // Is it installed?
                notInstalled: false,                  // Is it installed?
                packageWanted: '4.7.0',               // Requested version from the package.json.
                packageJson: '^4.6.1',                // Version or range requested in the parent package.json.
                devDependency: false,                 // Is this a devDependency?
                usedInScripts: undefined,             // Array of `scripts` in package.json that use this module.
                mismatch: false,                      // Does the version installed not match the range in package.json?
                semverValid: '4.6.1',                 // Is the installed version valid semver?
                easyUpgrade: false,                   // Will running just `npm install` upgrade the module?
                bump: 'minor',                        // What kind of bump is required to get the latest, such as patch, minor, major.
                unused: false,                        // Is this module used in the code?
            },
            {
                moduleName: 'babel',
                homepage: 'https://babel.com',
                regError: undefined,
                pkgError: undefined,
                latest: '9.1.0',
                installed: '7.8.9',
                isInstalled: true,
                notInstalled: false,
                packageJson: '^7.7.0',
                devDependency: true,
                usedInScripts: true,
                mismatch: false,
                semverValid: '7.8.9',
                easyUpgrade: false,
                bump: 'major',
                unused: false,
            },
            {
                moduleName: 'easy-upgrade',
                homepage: 'https://easy.com',
                regError: undefined,
                pkgError: undefined,
                latest: '1.1.1',
                installed: '1.1.0',
                isInstalled: true,
                notInstalled: false,
                packageJson: '^1.1.1',
                devDependency: true,
                usedInScripts: true,
                mismatch: false,
                semverValid: '1.1.1',
                easyUpgrade: true,
                bump: 'patch',
                unused: false,
            }];
        const currentStateSpy = {
            get: sinon.stub().returns(fakePackages),
        };
        checkerStub = sinon.stub().resolves(currentStateSpy);
        deps = await dependencies.recon(options, checkerStub)
            .then((result) => result)
            .catch((e) => {
                throw e
            });
    });
    afterEach(() => {
        deps = null;
        checkerStub = null;
        fakePackages = null;
    });
    it('returns valid dependency object', () => {
        expect(Object.entries(deps[0]).length).to.eql(8);
        expect(deps[0].moduleName).to.eql(fakePackages[0].moduleName);
        expect(deps[0].homepage).to.eql(fakePackages[0].homepage);
        expect(deps[0].latest).to.eql(fakePackages[0].latest);
        expect(deps[0].installed).to.eql(fakePackages[0].installed);
        expect(deps[0].packageWanted).to.eql(fakePackages[0].packageWanted);
        expect(deps[0].bump).to.eql(fakePackages[0].bump);
        expect(deps[0].usedInScripts).to.eql(fakePackages[0].usedInScripts);
    });
    it('filters out easy upgrade options', () => {
        expect(deps.some((dep) => dep.moduleName === 'easy-upgrade')).eql(false);
    });
    it('includes packages with a minor version bump', () => {

    });
    it('includes packages with a major version bump', () => {

    });
    it('includes packages with a patch version bump', () => {

    });
    it('filters out packages with a null version bump', () => {

    });

});