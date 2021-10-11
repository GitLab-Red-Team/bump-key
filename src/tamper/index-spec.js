/* eslint-disable import/no-duplicates */
import {
    beforeEach, afterEach, describe, it,
} from 'mocha';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tamper from './index.js';
import { SUPPORTED_COMMANDS } from '../constants/index.js';

chai.use(chaiAsPromised);

describe('tamper', () => {
    describe('tamperPackage', () => {
        let pkgLockData;
        let pkgLockOut;
        let command;
        let originalResolved;
        let expectedResolved;
        let originalIntegrity;
        let expectedIntegrity;
        let moduleName;
        let sandbox;
        let getTamperedPkgView;
        let getTamperedPkgViewInvalid;
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            moduleName = 'chalk';
            originalResolved = 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.12.13.tgz';
            originalIntegrity = 'sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==';
            expectedResolved = 'https://registry.npmjs.org/some/other/-/dep-7.12.13.tgz';
            expectedIntegrity = 'sha512-dqnqRkPMAjOZE0FogZ+ceJNM2dZ3V/yNOuFB7+39qpO93hHhfRpHw3heYQC7DPK9FqbQTfBKUJhiSfz4MvXYwg==';
            command = {
                options: {
                    lockfile: './',
                    package: moduleName,
                    replacement: 'chalkReplacement',
                },
            };
            pkgLockData = {
                name: 'bump-key',
                version: '0.0.1',
                lockfileVersion: 2,
                requires: true,
                dependencies: {
                    chalk: {
                        version: '4.1.2',
                        resolved: originalResolved,
                        integrity: originalIntegrity,
                        requires: {
                            'ansi-styles': '^4.1.0',
                            'supports-color': '^7.1.0',
                        },
                    },
                },
            };
            const npmViewData = {
                dist: {
                    integrity: expectedIntegrity,
                    tarball: expectedResolved,
                },
            };
            getTamperedPkgView = sandbox.stub().returns(npmViewData);
            getTamperedPkgViewInvalid = sandbox.stub().returns({});
            pkgLockOut = await tamper.tamperPackage(command, pkgLockData, getTamperedPkgView);
        });
        afterEach(() => {
            pkgLockData = undefined;
            pkgLockOut = undefined;
            command = undefined;
            sandbox.restore();
        });
        it('updates the resolved url of a targeted dependency', () => {
            expect(pkgLockOut.dependencies[moduleName].resolved).to.eql(expectedResolved);
        });
        it('updates the integrity hash of the target dependency', () => {
            expect(pkgLockOut.dependencies[moduleName].integrity).to.eql(expectedIntegrity);
        });
        it('errors when the target package is not found', async () => {
            expect(tamper.tamperPackage(command, pkgLockData, getTamperedPkgViewInvalid)).to.be.rejectedWith('Dependency missingDep not found...');
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
    describe('getTamperedPkgView', () => {
        let npmViewStub;
        let sandbox;
        let expectedTamperedPkgDetails;
        let actualTamperedPkgDetails;
        let loggerSpy;
        let tamperOptions;
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            expectedTamperedPkgDetails = {
                _id: 'viewjs@0.0.0',
                name: 'viewjs',
            };
            tamperOptions = {
                command: SUPPORTED_COMMANDS.TAMPER,
                options: {
                    lockfile: './',
                    package: 'viewjs',
                    replacement: 'tamperedViewJs',
                    debug: false,
                },
            };
            npmViewStub = sandbox.stub().returns(expectedTamperedPkgDetails);
            loggerSpy = sandbox.spy();
            actualTamperedPkgDetails = await tamper
                .getTamperedPkgView(tamperOptions, npmViewStub, loggerSpy);
        });
        afterEach(() => {
            sandbox.reset();
        });
        it('retrieves the npm view json for the replacement dependency', () => {
            expect(actualTamperedPkgDetails).to.eql(expectedTamperedPkgDetails);
        });
        it('logs the correct information', () => {
            expect(loggerSpy.calledWith('Retrieving package info for tampered package tamperedViewJs')).to.eql(true);
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
