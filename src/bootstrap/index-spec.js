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
            recon: {
                alias: 'r',
                description: 'Perform recon to find viable targets for tampering',
                required: false,
                requiresArg: true,
                type: 'string',
                nargs: 1,
            },
            tamper: {
                alias: 't',
                description: 'Tampers a lock file.  Provide positional arguments for the path to the target lock file, the integrrity hash of the targeted dependency in the lock file, and the URL of the replacement tar file.',
                required: false,
                type: 'array',
                requiresArg: true,
                nargs: 3,
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
