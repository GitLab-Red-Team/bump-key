/* eslint-disable import/no-duplicates */
import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import common from './index.js';

chai.use(chaiAsPromised);

describe('common', () => {
    describe('validateOptions', () => {
        let tamperOptions;
        let tamperOptionsResult;
        let requiredPropName;
        beforeEach(async () => {
            tamperOptions = { tamper: ['', '', ''] };
            requiredPropName = 'tamper';
            tamperOptionsResult = await common.validateOptions(tamperOptions, 'tamper');
        });
        afterEach(() => {
            tamperOptions = undefined;
            tamperOptionsResult = undefined;
        });
        it('invalidates when relavent property is missing', () => {
            expect(common.validateOptions({ recon: ['./'] }, 'missingPropName')).to.be.rejectedWith(Error);
        });
        it('invalidated when the expected property name is not passed', () => {
            expect(common.validateOptions({ recon: ['./'] })).to.be.rejectedWith(Error);
        });
        it('invalidated when the expected property name is empty', () => {
            expect(common.validateOptions({ recon: ['./'] }), '').to.be.rejectedWith(Error);
        });
        it('invalidates when options are undefined', () => {
            expect(common.validateOptions(undefined)).to.be.rejectedWith(Error);
        });
        it('returns the passed options when expected property is present and set', () => {
            expect(tamperOptionsResult).to.have.property(requiredPropName);
            expect(tamperOptionsResult.tamper).to.have.length(3);
        });
    });
});
