import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import {expect} from 'chai';
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
    it('should not have undefined options', () => {
        expect(options).not.to.eql(undefined);
    });
});
