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
        let parsedReconOptions;
        beforeEach(() => {
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
            parsedReconOptions = bootstrap.parseRawReconOptions(rawReconCommandOptionsWithDebug);
        });
        afterEach(() => { });
        it('throws if no raw options are not provided', () => {
            expect(() => bootstrap.parseRawOptions(undefined)).throws();
        });
        it('parses recon commands properly', () => {
            expect(parsedReconOptions.command).to.eql('recon');
            expect(parsedReconOptions.options.lockfile).to.eql('./');
        });
    });
    describe('parseRawTamperOptions', () => {
        let rawTamperCommandOptionsWithDebug;
        let parsedTamperOptions;
        beforeEach(() => {
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
            parsedTamperOptions = bootstrap.parseRawTamperOptions(rawTamperCommandOptionsWithDebug);
        });
        afterEach(() => { });
        it('throws if no raw options are not provided', () => {
            expect(() => bootstrap.parseRawTamperOptions(undefined)).throws();
        });
        it('parses tamper commands properly with debug option set', () => {
            expect(parsedTamperOptions.command).to.eql('tamper');
            expect(parsedTamperOptions.options.lockfile).to.eql('./');
            expect(parsedTamperOptions.options.package).to.eql('one');
            expect(parsedTamperOptions.options.replacement).to.eql('two');
            expect(parsedTamperOptions.options.debug).to.eql(true);
        });
    });
});
