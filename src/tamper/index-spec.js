/* eslint-disable import/no-duplicates */
import {
    beforeEach, afterEach, describe, it,
} from 'mocha';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tamper from './index.js';

chai.use(chaiAsPromised);

describe('tamper', () => {
    describe('tamperPackage', () => {
        let pkgLockData;
        let pkgLockOut;
        let options;
        let originalResolved;
        let expectedResolved;
        let moduleName;
        beforeEach(async () => {
            moduleName = 'chalk';
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
                dependencies: {
                    chalk: {
                        version: '4.1.2',
                        resolved: 'https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz',
                        integrity: 'sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==',
                        requires: {
                            'ansi-styles': '^4.1.0',
                            'supports-color': '^7.1.0',
                        },
                    },
                },
            };
            pkgLockOut = await tamper.tamperPackage(options.tamper, pkgLockData);
        });
        afterEach(() => {
            pkgLockData = undefined;
            pkgLockOut = undefined;
            options = undefined;
        });
        it('updates the resolved url of a targeted dependency', () => {
            expect(pkgLockOut.dependencies[moduleName].resolved).to.eql(expectedResolved);
        });
        it('errors when the target package is not found', async () => {
            expect(tamper.tamperPackage(['./', 'missingDep', expectedResolved], pkgLockData)).to.be.rejectedWith('Dependency missingDep not found...');
        });
    });
    describe('readPackageLock', () => {
        let fileReaderSpy;
        let loggerSpy;
        let fileReaderErrorStub;
        let sandbox;
        const dir = '/opt/somedir';
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            fileReaderSpy = sandbox.spy();
            loggerSpy = sandbox.spy();
            fileReaderErrorStub = sandbox.stub().returns(Promise.reject(new Error('File not found...')));
            await tamper.readPackageLock(dir, loggerSpy, fileReaderSpy);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('makes proper calls to the file reader function', () => {
            expect(fileReaderSpy.callCount).to.eql(1);
            expect(fileReaderSpy.args[0][0]).to.eql(`${dir}/package-lock.json`);
            expect(fileReaderSpy.args[0][1]).to.eql('utf8');
        });
        it('errors when the package-lock file cannot be found', () => {
            expect(tamper.readPackageLock(dir, fileReaderErrorStub)).to.be.rejectedWith('File not found...');
        });
        it('called the logger function correctly', () => {
            expect(loggerSpy.callCount).to.eql(1);
        });
    });
    describe('writeTamperedPackageLock', () => {
        let fileWriterSpy;
        let loggerSpy;
        let fileWriterErrorStub;
        let sandbox;
        const dir = '/opt/somedir';
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            loggerSpy = sandbox.spy();
            fileWriterSpy = sandbox.spy();
            fileWriterErrorStub = sandbox.stub().returns(Promise.reject(new Error('File not found...')));
            await tamper.writeTamperedPackageLock(dir, {}, loggerSpy, fileWriterSpy);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('makes proper calls to the file writer function', async () => {
            expect(fileWriterSpy.callCount).to.eql(1);
            expect(fileWriterSpy.args[0][0]).to.eql(`${dir}/package-lock.json`);
            expect(typeof fileWriterSpy.args[0][1]).to.eql('string');
            expect(fileWriterSpy.args[0][1].length).to.eql(2);
        });
        it('errors when the package-lock file cannot be written to', () => {
            expect(tamper.writeTamperedPackageLock(dir, {}, fileWriterErrorStub)).to.be.rejectedWith('File not found...');
        });
        it('calls the logging function correct', () => {
            expect(loggerSpy.callCount).to.eql(1);
        });
    });
});
