import { expect } from 'chai';
import {
    afterEach,
    beforeEach,
    describe,
    it,
} from 'mocha';
import sinon from 'sinon';
import recon from './index.js';

describe('recon', () => {
    const augmentedDeps = {
        upgradable: [
            {
                bugsUrl: 'https://github.com/sindresorhus/get-stdin/issues',
                devDependencies: 5,
                dependencies: 0,
                author: 'Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)',
                moduleName: 'get-stdin',
                homepage: 'https://github.com/sindresorhus/get-stdin#readme',
                specified: '8.0.0',
                latest: '9.0.0',
                installed: '8.0.0',
                packageWanted: '8.0.0',
                bump: 'major',
                usedInScripts: false,
                easyUpgrade: false,
            },
            {
                bugsUrl: 'https://github.com/sindresorhus/string-width/issues',
                devDependencies: 2,
                dependencies: 2,
                author: 'Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)',
                moduleName: 'a-string-width',
                homepage: 'https://github.com/sindresorhus/string-width#readme',
                specified: '~2.1.1',
                latest: '5.0.1',
                installed: '2.1.1',
                packageWanted: '2.1.1',
                bump: 'major',
                usedInScripts: false,
                easyUpgrade: false,
            }],
        filtered: [
            {
                moduleName: 'rollup-plugin-string',
                homepage: 'https://github.com/TrySound/rollup-plugin-string',
                specified: '3.0.0',
                latest: '3.0.0',
                installed: '3.0.0',
                packageWanted: '3.0.0',
                bump: null,
                usedInScripts: false,
                easyUpgrade: true,
            },
            {
                moduleName: 'tap-dot',
                homepage: 'https://github.com/scottcorgan/tap-dot',
                specified: '2.0.0',
                latest: '2.0.0',
                installed: '2.0.0',
                packageWanted: '2.0.0',
                bump: null,
                usedInScripts: 'test',
                easyUpgrade: true,
            }],
    };
    describe('getNpmCheckDetails', () => {
        let sandbox;
        let executeNpmCheckSpy;
        let command;
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            executeNpmCheckSpy = sandbox.spy();
            command = {
                command: 'recon',
                options: {
                    lockfile: './',
                    debug: false,
                },
            };
            await recon.getNpmCheckDetails(command, executeNpmCheckSpy);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('makes the proper call to the executeNpmCheck function', () => {
            sinon.assert.calledWith(executeNpmCheckSpy, command);
        });
    });
    describe('augmentWithNpmView', () => {
        let allDeps;
        let sandbox;
        let augmentSpy;
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            allDeps = {
                upgradable: [{
                    moduleName: 'get-stdin',
                    homepage: 'https://github.com/sindresorhus/get-stdin#readme',
                    specified: '8.0.0',
                    latest: '9.0.0',
                    installed: '8.0.0',
                    packageWanted: '8.0.0',
                    bump: 'major',
                    usedInScripts: false,
                    easyUpgrade: false,
                },
                {
                    moduleName: 'a-string-width',
                    homepage: 'https://github.com/sindresorhus/string-width#readme',
                    specified: '~2.1.1',
                    latest: '5.0.1',
                    installed: '2.1.1',
                    packageWanted: '2.1.1',
                    bump: 'major',
                    usedInScripts: false,
                    easyUpgrade: false,
                }],
                filtered: [{
                    moduleName: 'rollup-plugin-string',
                    homepage: 'https://github.com/TrySound/rollup-plugin-string',
                    specified: '3.0.0',
                    latest: '3.0.0',
                    installed: '3.0.0',
                    packageWanted: '3.0.0',
                    bump: null,
                    usedInScripts: false,
                    easyUpgrade: true,
                },
                {
                    moduleName: 'tap-dot',
                    homepage: 'https://github.com/scottcorgan/tap-dot',
                    specified: '2.0.0',
                    latest: '2.0.0',
                    installed: '2.0.0',
                    packageWanted: '2.0.0',
                    bump: null,
                    usedInScripts: 'test',
                    easyUpgrade: true,
                }],
            };
            augmentSpy = sandbox.spy();
            await recon.augmentWithNpmView(allDeps, augmentSpy);
        });
        afterEach(() => {
            sandbox.restore();
            allDeps = undefined;
        });
        it('makes the proper call to the augment function', () => {
            sinon.assert.calledOnce(augmentSpy);
        });
    });
    describe('rankUpgradablePackagesByTotalDeps', () => {
        let actualSortedDeps;
        beforeEach(() => {
            actualSortedDeps = recon.rankUpgradablePackagesByTotalDeps(augmentedDeps);
        });
        afterEach(() => {
            actualSortedDeps = undefined;
        });
        it('sorts upgradable dependencies properly', () => {
            expect(augmentedDeps.upgradable[0].moduleName).to.eql(
                actualSortedDeps.upgradable[0].moduleName,
            );
        });
    });
});
