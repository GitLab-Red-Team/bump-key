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
        let actualAugmentedDeps;
        let expectedAugmentedDeps;
        beforeEach(async () => {
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
                }],
            };
            expectedAugmentedDeps = {
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
                    }],
            };
            actualAugmentedDeps = await recon.augmentWithNpmView(allDeps);
        });
        afterEach(() => {
            allDeps = undefined;
        });
        it('makes the proper call to the augment function', () => {
            expect(actualAugmentedDeps).to.eql(expectedAugmentedDeps);
        });
    });
});
