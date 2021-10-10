import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import bootstrap from './index.js';

describe('bootstrap', () => {
    let options;
    let optionSpy;
    let commandSpy;
    let argParserSpy;
    let obj;

    beforeEach(() => {
        commandSpy = sinon.spy(() => obj);
        optionSpy = sinon.spy(() => obj);
        argParserSpy = sinon.spy(() => obj);
        obj = {
            command: commandSpy,
            options: optionSpy,
            argv: [],
        };
        options = bootstrap.start(argParserSpy, false);
    });
    afterEach(() => {
        options = undefined;
    });
    it('should call the argParser function once', () => {
        expect(argParserSpy.calledOnce).to.eql(true);
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
                dependency: {
                    alias: 'd',
                    description: 'The name of the target dependency in the lockfile',
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
