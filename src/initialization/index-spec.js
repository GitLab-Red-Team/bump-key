import {
    describe, beforeEach, afterEach, it,
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import init from './index.js';

describe('initialization', () => {
    let options; let optionSpy; let argParserSpy; let
        obj;

    beforeEach(() => {
        optionSpy = sinon.spy(() => obj);
        argParserSpy = sinon.spy(() => obj);
        obj = {
            options: optionSpy,
            argv: [],
        };
        options = init.setOptions(argParserSpy);
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
            root: {
                alias: 'r',
                description: 'The root directory of the targeted project',
                requiresArg: true,
                required: true,
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
