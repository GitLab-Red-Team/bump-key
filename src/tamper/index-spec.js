/* eslint-disable import/no-duplicates */
import {
    beforeEach, afterEach, describe, it,
} from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import tamper from './index.js';

describe('tamper', () => {
    describe('updateDependency', () => {
        let pkgLockData;
        let pkgLockOut;
        let options;
        let originalResolved;
        let expectedResolved;
        let moduleName;
        beforeEach(async () => {
            moduleName = 'node_modules/@babel/code-frame';
            originalResolved = 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.12.13.tgz';
            expectedResolved = 'https://registry.npmjs.org/some/other/-/dep-7.12.13.tgz';
            options = {
                tamper: ['./', moduleName, expectedResolved],
            };
            pkgLockData = {
                name: 'bump-key',
                version: '0.0.1',
                lockfileVersion: 2,
                requires: true,
                packages: {
                    '': {
                        license: 'GPL-3.0-or-later',
                        dependencies: {
                            chalk: '^4.1.0',
                        },
                        bin: {
                            'bump-key': 'src/index.js',
                        },
                        devDependencies: {
                            chai: '^4.3.3',
                        },
                    },
                    'node_modules/@babel/code-frame': {
                        version: '7.12.13',
                        resolved: originalResolved,
                        integrity: 'sha512-HV1Cm0Q3ZrpCR93tkWOYiuYIgLxZXZFVG2VgK+MBWjUqZTundupbfx2aXarXuw5Ko5aMcjtJgbSs4vUGBS5v6g==',
                        dependencies: {
                            '@babel/highlight': '^7.12.13',
                        },
                    },
                },
            };
            pkgLockOut = await tamper.updatePackage(options.tamper, pkgLockData);
        });
        afterEach(() => {
            pkgLockData = undefined;
            pkgLockOut = undefined;
            options = undefined;
        });
        it('updates the resolved url of a targeted dependency', () => {
            expect(pkgLockOut.packages[moduleName].resolved).to.eql(expectedResolved);
        });
        it('errors when the target package is not found', async () => {
            expect(() => tamper.updatePackage(['./', 'missingDep', expectedResolved], pkgLockData)).to.throw('Dependency missingDep not found...');
        });
    });
    describe('readPackageLock', () => {
        let fileReaderSpy;
        const dir = '/opt/somedir';
        beforeEach(async () => {
            fileReaderSpy = sinon.spy();
            await tamper.readPackageLock(dir, fileReaderSpy);
        });
        it('makes proper calls to the file reader function', async () => {
            expect(fileReaderSpy.callCount).to.equal(1);
            expect(fileReaderSpy.args[0][0]).to.equal(`${dir}/package-lock.json`);
            expect(fileReaderSpy.args[0][1]).to.equal('utf8');
        });
    });
});
