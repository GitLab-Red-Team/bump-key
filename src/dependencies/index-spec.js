import process from 'process';
import sinon from 'sinon';
import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { BUMP, DEFAULT_VALUES } from '../constants/index.js';
import dependencies from './index.js';

chai.use(chaiAsPromised);

describe('dependendencies', () => {
    let fakePackages;
    beforeEach(() => {
        /* eslint-disable max-len */
        fakePackages = [
            {
                moduleName: 'lodash', // name of the module.
                homepage: 'https://lodash.com/', // url to the home page.
                regError: undefined, // error communicating with the registry
                pkgError: undefined, // error reading the package.json
                latest: '4.7.0', // latest according to the registry.
                installed: '4.5.1', // version installed
                isInstalled: true, // Is it installed?
                notInstalled: false, // Is it installed?
                packageWanted: '4.7.0', // Requested version from the package.json.
                packageJson: '^4.6.1', // Version or range requested in the parent package.json.
                devDependency: false, // Is this a devDependency?
                usedInScripts: undefined, // Array of `scripts` in package.json that use this module.
                mismatch: false, // Does the version installed not match the range in package.json?
                semverValid: '4.6.1', // Is the installed version valid semver?
                easyUpgrade: false, // Will running just `npm install` upgrade the module?
                bump: 'minor', // What kind of bump is required to get the latest, such as patch, minor, major.
                unused: false, // Is this module used in the code?
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
            },
            {
                moduleName: 'patch-upgrade',
                homepage: 'https://patch.com',
                regError: undefined,
                pkgError: undefined,
                latest: '5.1.9',
                installed: '5.1.0',
                isInstalled: true,
                notInstalled: false,
                packageJson: '^5.1.0',
                devDependency: false,
                usedInScripts: true,
                mismatch: false,
                semverValid: '5.1.0',
                easyUpgrade: false,
                bump: 'patch',
                unused: false,
            },
            {
                moduleName: 'null-upgrade',
                homepage: 'https://patch.com',
                regError: undefined,
                pkgError: undefined,
                latest: '6.1.9',
                installed: '6.1.9',
                isInstalled: true,
                notInstalled: false,
                packageJson: '^6.1.9',
                devDependency: false,
                usedInScripts: true,
                mismatch: false,
                semverValid: '6.1.9',
                easyUpgrade: false,
                bump: null,
                unused: false,
            },
            {
                moduleName: 'invalid-semver',
                regError: undefined,
                pkgError: undefined,
                latest: '0.0.62',
                installed: '0.0.62',
                isInstalled: true,
                notInstalled: false,
                packageJson: '^0.0.62',
                devDependency: false,
                usedInScripts: true,
                mismatch: false,
                semverValid: '6.1.9',
                easyUpgrade: false,
                bump: 'nonSemver',
                unused: false,
            }];
    });
    afterEach(() => {
        fakePackages = undefined;
    });
    describe('augmentWithNpmView', () => {
        let augmentedLodashDeps;
        let augmentedBabelDeps;
        let fakeNpmViewCommandLodash;
        let fakeNpmViewCommandBabel;
        let fakeNpmViewLodash;
        let fakeNpmViewBabel;
        beforeEach(async () => {
            fakeNpmViewLodash = {
                name: 'lodash',
                author: 'John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)',
                bugs: {
                    url: 'https://github.com/lodash/lodash/issues',
                },
            };
            fakeNpmViewBabel = {
                name: 'babel',
                devDependencies: {
                    chai: '^4.3.3',
                    mocha: '^8.3.1',
                },
                dependencies: {
                    chalk: '^4.1.0',
                },
            };
            fakeNpmViewCommandLodash = async () => fakeNpmViewLodash;
            fakeNpmViewCommandBabel = async () => fakeNpmViewBabel;
            augmentedLodashDeps = await dependencies.augmentWithNpmView(fakeNpmViewCommandLodash, [fakePackages[0]]);
            augmentedBabelDeps = await dependencies.augmentWithNpmView(fakeNpmViewCommandBabel, [fakePackages[1]]);
        });
        afterEach(() => {
            fakeNpmViewLodash = undefined;
            fakeNpmViewCommandLodash = undefined;
            augmentedLodashDeps = undefined;
            fakeNpmViewBabel = undefined;
            fakeNpmViewCommandBabel = undefined;
            augmentedBabelDeps = undefined;
        });
        it('augments an existing object with a bugs url', () => {
            expect(augmentedLodashDeps[0].bugsUrl).to.eql(fakeNpmViewLodash.bugs.url);
        });
        it('augments an existing object with devDependencyCount when devDependencies '
            + 'is undefined on the source object', () => {
            expect(augmentedLodashDeps[0].devDependencies).to.eql(0);
        });
        it('augments an existing object with dependencyCount when dependencies '
            + 'is undefined on the source object', () => {
            expect(augmentedLodashDeps[0].dependencies).to.eql(0);
        });
        it('augments an existing object when a author property is missing', () => {
            expect(augmentedLodashDeps[0].author).to.eql(fakeNpmViewLodash.author);
        });
        it('augments an existing object when a bugs url is missing', () => {
            expect(augmentedBabelDeps[0].bugsUrl).to.eql(DEFAULT_VALUES.MISSING_PROP);
        });
        it('augments an existing object when a author property is missing', () => {
            expect(augmentedBabelDeps[0].author).to.eql(DEFAULT_VALUES.MISSING_PROP);
        });
        it('augments an existing object with dependencyCount when dependencies '
            + 'are defined on the source object', () => {
            expect(augmentedBabelDeps[0].dependencies).to.eql(1);
        });
        it('augments an existing object with devDependencyCount when devDependencies '
            + 'are defined on the source object', () => {
            expect(augmentedBabelDeps[0].devDependencies).to.eql(2);
        });
        it('rejects when invalid dependency data is passed', async () => {
            await expect(dependencies.augmentWithNpmView(fakeNpmViewCommandBabel, undefined)).to.be.rejectedWith(Error);
        });
        it('rejects when invalid npm view data is passed', async () => {
            await expect(dependencies.augmentWithNpmView(undefined, [fakePackages[1]])).to.be.rejectedWith(Error);
        });
    });
    describe('executeNpmCheck', () => {
        let deps;
        let checkerStub;
        const options = {
            options: {
                lockfile: process.cwd(),
            },
        };
        beforeEach(async () => {
            const currentStateSpy = {
                get: sinon.stub().returns(fakePackages),
            };
            checkerStub = sinon.stub().resolves(currentStateSpy);
            deps = await dependencies.executeNpmCheck(options, checkerStub);
        });
        afterEach(() => {
            deps = null;
            checkerStub = null;
        });
        it('returns valid dependency object', () => {
            expect(Object.entries(deps.upgradable[0]).length).to.eql(9);
            expect(deps.upgradable[0].moduleName).to.eql(fakePackages[0].moduleName);
            expect(deps.upgradable[0].homepage).to.eql(fakePackages[0].homepage);
            expect(deps.upgradable[0].specified).to.eql(fakePackages[0].packageJson);
            expect(deps.upgradable[0].latest).to.eql(fakePackages[0].latest);
            expect(deps.upgradable[0].installed).to.eql(fakePackages[0].installed);
            expect(deps.upgradable[0].packageWanted).to.eql(fakePackages[0].packageWanted);
            expect(deps.upgradable[0].bump).to.eql(fakePackages[0].bump);
            expect(deps.upgradable[0].usedInScripts).to.eql(false);
        });
        it('filters out easy upgrade options', () => {
            expect(deps.upgradable.some((dep) => dep.easyUpgrade === true)).eql(false);
            expect(deps.filtered.some((dep) => dep.easyUpgrade === true)).eql(true);
        });
        it('includes packages with a minor version bump', () => {
            expect(deps.upgradable.some((dep) => dep.bump === BUMP.minor)).eql(true);
        });
        it('includes packages with a major version bump', () => {
            expect(deps.upgradable.some((dep) => dep.bump === BUMP.major)).eql(true);
        });
        it('includes packages with a patch version bump', () => {
            expect(deps.upgradable.some((dep) => dep.bump === BUMP.patch)).eql(true);
        });
        it('filters out packages with a null version bump', () => {
            expect(deps.upgradable.some((dep) => dep.bump === BUMP.null)).eql(false);
            expect(deps.filtered.some((dep) => dep.bump === BUMP.null)).eql(true);
        });
        it('filters out non-semantically versioned packages', () => {
            expect(deps.upgradable.some((dep) => dep.bump === BUMP.nonSemver)).eql(false);
            expect(deps.filtered.some((dep) => dep.bump === BUMP.nonSemver)).eql(true);
        });
        it('handles a missing homepage property', () => {
            expect(deps.filtered.some((dep) => dep.homepage === DEFAULT_VALUES.MISSING_PROP)).eql(true);
        });
    });
});
