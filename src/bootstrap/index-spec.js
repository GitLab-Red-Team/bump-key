import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import bootstrap from './index.js';

describe('bootstrap', () => {
    let options;
    let optionSpy;
    let argParserSpy;
    let obj;

    beforeEach(() => {
        optionSpy = sinon.spy(() => obj);
        argParserSpy = sinon.spy(() => obj);
        obj = {
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
    it('should construct the correct option set', () => {
        sinon.assert.calledWith(optionSpy, {
            help: {
                alias: 'h',
            },
            version: {
                alias: 'v',
            },
            recon: {
                alias: 'r',
                description: 'Default option if no other parameters are given',
                required: false,
                requiredArg: true,
            },
            tamper: {
                alias: 't',
                description: 'Specify the path to the lock file to tamper along with a SHA1',
                required: false,
                requiredArg: true,
            },
            debug: {
                alias: 'd',
                description: 'Enables additional output to aid in debugging',
                requiresArg: false,
                required: false,
            },
        });
    });
    it('should not have undefined options', () => {
        expect(options).not.to.eql(undefined);
    });
});
