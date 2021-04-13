import process from 'process';
import sinon from 'sinon';
import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import { expect } from 'chai';
import { BUMP } from '../constants/index.js';
import dependencies from './index.js';

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
                homepage: 'https://semver-none.com',
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
        let augmentedDeps; let someAsyncCommandFunc; let
            someFakeNpmViewLodashData;
        beforeEach(() => {
            someFakeNpmViewLodashData = {
                _id: 'lodash@4.5.1',
                _rev: '2575-0d24eda2ecf36ac653aabad704a6e830',
                name: 'lodash',
                description: 'Lodash modular utilities.',
                'dist-tags': {
                    latest: '4.17.21',
                },
                versions: [
                    '4.17.19',
                    '4.17.20',
                    '4.17.21',
                ],
                maintainers: [
                    'jdalton <john.david.dalton@gmail.com>',
                    'jridgewell <justin+npm@ridgewell.name>',
                    'mathias <mathias@qiwi.be>',
                    'phated <blaine.bublitz@gmail.com>',
                ],
                time: {
                    '4.17.19': '2020-07-08T17:14:40.866Z',
                    '4.17.20': '2020-08-13T16:53:54.152Z',
                    '4.17.21': '2021-02-20T15:42:16.891Z',
                },
                author: 'John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)',
                repository: {
                    type: 'git',
                    url: 'git+https://github.com/lodash/lodash.git',
                },
                users: {
                    sjonnet: true,
                    fgribreau: true,
                    sjonnet19: true,
                },
                readmeFilename: 'README.md',
                homepage: 'https://lodash.com/',
                keywords: [
                    'modules',
                    'stdlib',
                    'util',
                ],
                contributors: [
                    'John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)',
                    'Blaine Bublitz <blaine.bublitz@gmail.com> (https://github.com/phated)',
                    'Mathias Bynens <mathias@qiwi.be> (https://mathiasbynens.be/)',
                ],
                bugs: {
                    url: 'https://github.com/lodash/lodash/issues',
                },
                license: 'MIT',
                _cached: true,
                _contentLength: 0,
                version: '4.5.1',
                icon: 'https://lodash.com/icon.svg',
                main: 'lodash.js',
                scripts: {
                    test: 'echo "See https://travis-ci.org/lodash/lodash-cli for testing details."',
                },
                _shasum: '80e8a074ca5f3893a6b1c10b2a636492d710c316',
                _from: '.',
                _npmVersion: '2.14.17',
                _nodeVersion: '5.5.0',
                _npmUser: 'jdalton <john.david.dalton@gmail.com>',
                dist: {
                    shasum: '80e8a074ca5f3893a6b1c10b2a636492d710c316',
                    tarball: 'https://registry.npmjs.org/lodash/-/lodash-4.5.1.tgz',
                },
                _npmOperationalInternal: {
                    host: 'packages-9-west.internal.npmjs.com',
                    tmp: 'tmp/lodash-4.5.1.tgz_1456123341085_0.7924484650138766',
                },
                directories: {},
            };
            someAsyncCommandFunc = sinon.stub().resolves(someFakeNpmViewLodashData);
            augmentedDeps = dependencies.augmentWithNpmView(someAsyncCommandFunc, fakePackages);
        });
        afterEach(() => {
            someFakeNpmViewLodashData = undefined;
            someAsyncCommandFunc = undefined;
            augmentedDeps = undefined;
        });
        it('augments an existing object with a bugs url', () => {
            augmentedDeps.bugsUrl = someFakeNpmViewLodashData.bugs.url;
        });
    });
    describe('executeNpmCheck', () => {
        let deps;
        let checkerStub;
        const options = {
            cwd: process.cwd(),
        };
        beforeEach(async () => {
            const currentStateSpy = {
                get: sinon.stub().returns(fakePackages),
            };
            checkerStub = sinon.stub().resolves(currentStateSpy);
            deps = await dependencies.executeNpmCheck(options, checkerStub)
                .then((result) => result)
                .catch((e) => {
                    throw e;
                });
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
            expect(deps.upgradable[0].usedInScripts).to.eql(fakePackages[0].usedInScripts);
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
    });
});
