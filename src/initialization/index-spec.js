import init from './index.js';

import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

describe('initialization', () => {

    let options, optionSpy, argParserSpy, obj;

    beforeEach(() => {
        optionSpy = sinon.spy(() => obj);
        argParserSpy = sinon.spy(() => obj);
        obj = {
            options: optionSpy,
            argv: []
        }
        options = init.setOptions(argParserSpy);
    });
    afterEach(() => {
        options = undefined;
    });
    it('should call the argParser function once', () => {
        expect(argParserSpy.calledOnce).to.eql(true);
    });
    it('should construct the correct path option', () => {
        sinon.assert.calledWith(optionSpy, {
            help: {
                alias: 'h'
            },
            version: {
                alias: 'v'
            },
            root: {
                alias: 'r',
                description: 'The root directory of the targeted project',
                requiresArg: true,
                required: true
            },
        });
    });
    it('should not have undefined options', () => {
        expect(options).not.to.eql(undefined);
    });
});