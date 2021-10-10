import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import bootstrap from './index.js';

describe('bootstrap', () => {
    describe('start', () => {
        let sandbox;
        let optionSpy;
        let commandSpy;
        let argParserSpy;
        let obj;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            commandSpy = sandbox.spy(() => obj);
            optionSpy = sandbox.spy(() => obj);
            argParserSpy = sandbox.spy(() => obj);
            obj = {
                command: commandSpy,
                options: optionSpy,
                argv: [],
            };
            bootstrap.start(argParserSpy, false);
        });
        afterEach(() => {
            sandbox.restore();
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
                    package: {
                        alias: 'p',
                        description: 'The name of the target package in the lockfile',
                        required: true,
                        requiresArg: true,
                        type: 'string',
                        nargs: 1,
                    },
                    replacement: {
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
                package: 'one',
                r: 'two',
                replacement: 'two',
                $0: 'src/index.js',
            };
            rawTamperCommandOptionsWithDebug = {
                _: [
                    'tamper',
                ],
                l: './',
                lockfile: './',
                p: 'one',
                package: 'one',
                r: 'two',
                replacement: 'two',
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
            expect(parsedTamperOptionsWithDebug.options.package).to.eql('one');
            expect(parsedTamperOptionsWithDebug.options.replacement).to.eql('two');
            expect(parsedTamperOptionsWithDebug.options.debug).to.eql(true);
        });
        it('parses tamper commands propertly without debug option set', () => {
            expect(parsedTamperOptionsWithoutDebug.command).to.eql('tamper');
            expect(parsedTamperOptionsWithoutDebug.options.lockfile).to.eql('./');
            expect(parsedTamperOptionsWithoutDebug.options.package).to.eql('one');
            expect(parsedTamperOptionsWithoutDebug.options.replacement).to.eql('two');
            expect(parsedTamperOptionsWithoutDebug.options.debug).to.eql(false);
        });
    });
});
