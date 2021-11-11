import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

import { FILES } from '../constants/index.js';
import bootstrap from './index.js';

chai.use(chaiAsPromised);

describe('bootstrap', () => {
    describe('start', () => {
        let sandbox;
        let optionSpy;
        let commandSpy;
        let demandCommandSpy;
        let argParserSpy;
        let rawOptionsParserSpy;
        let obj;

        beforeEach(async () => {
            sandbox = sinon.createSandbox();
            commandSpy = sandbox.spy(() => obj);
            optionSpy = sandbox.spy(() => obj);
            argParserSpy = sandbox.spy(() => obj);
            rawOptionsParserSpy = sandbox.spy();
            demandCommandSpy = sandbox.spy(() => obj);
            obj = {
                command: commandSpy,
                options: optionSpy,
                demandCommand: demandCommandSpy,
                argv: [],
            };
            await bootstrap.start(argParserSpy, rawOptionsParserSpy, false);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('should require at least one command', () => {
            expect(demandCommandSpy.calledOnce).to.eql(true);
            expect(demandCommandSpy.calledWith(1)).to.eql(true);
        });
        it('should call the rawOptionsParser function once', () => {
            expect(rawOptionsParserSpy.calledOnce).to.eql(true);
        });
        it('should call the argParser function once', () => {
            expect(argParserSpy.calledOnce).to.eql(true);
        });
        it('should construct two commands', () => {
            expect(commandSpy.callCount).to.eql(2);
        });
        it('should construct the correct recon command set', () => {
            sinon.assert.calledWith(commandSpy, 'recon', 'Perform reconnaissance to determine potential targets within a project',
                {
                    lockfile: {
                        alias: 'l',
                        description: 'The path to the target lockfile',
                        required: true,
                        requiresArg: true,
                        type: 'string',
                        nargs: 1,
                    },
                });
        });
        it('should construct the correct tamper command set', () => {
            sinon.assert.calledWith(commandSpy, 'tamper', 'Tamper a lockfile by supplying target package name and replacement name',
                {
                    lockfile: {
                        alias: 'l',
                        description: 'The path to the target lockfile',
                        required: true,
                        requiresArg: true,
                        type: 'string',
                        nargs: 1,
                    },
                    packageName: {
                        alias: 'p',
                        description: 'The name of the target package in the lockfile',
                        required: true,
                        requiresArg: true,
                        type: 'string',
                        nargs: 1,
                    },
                    replacementName: {
                        alias: 'r',
                        description: 'The name of npmjs.org dependency to replace the target',
                        required: true,
                        requiresArg: true,
                        type: 'string',
                        nargs: 1,
                    },
                });
        });
        it('should construct the correct option set', () => {
            sinon.assert.calledWith(optionSpy, {
                help: {
                    alias: 'h',
                },
                debug: {
                    alias: 'd',
                    description: 'Enables additional output to aid in debugging',
                    requiresArg: false,
                    required: false,
                },
            });
        });
    });
    describe('parseRawReconOptions', () => {
        let rawReconCommandOptionsWithDebug;
        let parsedReconOptionsWithDebug;
        let rawReconOptionsWithoutDebug;
        let parsedReconOptionsWithoutDebug;
        let rawOptionsWithoutSupportedCommand;
        beforeEach(() => {
            rawReconOptionsWithoutDebug = {
                _: [
                    'recon',
                ],
                l: './',
                lockfile: './',
                $0: 'src/index.js',
            };
            rawReconCommandOptionsWithDebug = {
                _: [
                    'recon',
                ],
                l: './',
                lockfile: './',
                d: true,
                debug: true,
                $0: 'src/index.js',
            };
            rawOptionsWithoutSupportedCommand = {
                _: [],
            };
            parsedReconOptionsWithDebug = bootstrap
                .parseRawReconOptions(rawReconCommandOptionsWithDebug);
            parsedReconOptionsWithoutDebug = bootstrap
                .parseRawReconOptions(rawReconOptionsWithoutDebug);
        });
        afterEach(() => { });
        it('throws if no raw options are not provided', () => {
            expect(() => bootstrap.parseRawOptions(undefined)).throws();
        });
        it('parses recon commands properly with debug option set', () => {
            expect(parsedReconOptionsWithDebug.command).to.eql('recon');
            expect(parsedReconOptionsWithDebug.options.lockfile).to.eql('./');
            expect(parsedReconOptionsWithDebug.options.debug).to.eql(true);
        });
        it('parses recon commands properly without the debug option set', () => {
            expect(parsedReconOptionsWithoutDebug.command).to.eql('recon');
            expect(parsedReconOptionsWithoutDebug.options.lockfile).to.eql('./');
            expect(parsedReconOptionsWithoutDebug.options.debug).to.eql(false);
        });
        it('returns undefined if no supported commands are found', () => {
            expect(() => bootstrap.parseRawOptions(rawOptionsWithoutSupportedCommand)).to.throw();
        });
    });
    describe('parseRawTamperOptions', () => {
        let rawTamperCommandOptionsWithDebug;
        let rawTamperOptionsWithoutDebug;
        let parsedTamperOptionsWithDebug;
        let parsedTamperOptionsWithoutDebug;
        beforeEach(() => {
            rawTamperOptionsWithoutDebug = {
                _: [
                    'tamper',
                ],
                l: './',
                lockfile: './',
                p: 'one',
                packageName: 'one',
                r: 'two',
                replacementName: 'two',
                $0: 'src/index.js',
            };
            rawTamperCommandOptionsWithDebug = {
                _: [
                    'tamper',
                ],
                l: './',
                lockfile: './',
                p: 'one',
                packageName: 'one',
                r: 'two',
                replacementName: 'two',
                d: true,
                debug: true,
                $0: 'src/index.js',
            };
            parsedTamperOptionsWithDebug = bootstrap
                .parseRawTamperOptions(rawTamperCommandOptionsWithDebug);
            parsedTamperOptionsWithoutDebug = bootstrap
                .parseRawTamperOptions(rawTamperOptionsWithoutDebug);
        });
        afterEach(() => { });
        it('throws if no raw options are not provided', () => {
            expect(() => bootstrap.parseRawTamperOptions(undefined)).throws();
        });
        it('parses tamper commands properly with debug option set', () => {
            expect(parsedTamperOptionsWithDebug.command).to.eql('tamper');
            expect(parsedTamperOptionsWithDebug.options.lockfile).to.eql('./');
            expect(parsedTamperOptionsWithDebug.options.packageName).to.eql('one');
            expect(parsedTamperOptionsWithDebug.options.replacementName).to.eql('two');
            expect(parsedTamperOptionsWithDebug.options.debug).to.eql(true);
        });
        it('parses tamper commands properly without debug option set', () => {
            expect(parsedTamperOptionsWithoutDebug.command).to.eql('tamper');
            expect(parsedTamperOptionsWithoutDebug.options.lockfile).to.eql('./');
            expect(parsedTamperOptionsWithoutDebug.options.packageName).to.eql('one');
            expect(parsedTamperOptionsWithoutDebug.options.replacementName).to.eql('two');
            expect(parsedTamperOptionsWithoutDebug.options.debug).to.eql(false);
        });
    });
});
