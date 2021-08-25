/* eslint-disable import/no-duplicates */
import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import tamper from './index.js';

chai.use(chaiAsPromised);

describe('tamper', () => {
    describe('validateOptions', () => {
        let tamperOptions;
        let tamperOptionsResult;
        beforeEach(async () => {
            tamperOptions = { tamper: ['', '', ''] };
            tamperOptionsResult = await tamper.validateOptions(tamperOptions);
        });
        afterEach(() => {
        });
        it('invalidates when relavent property is missing', () => {
            expect(tamper.validateOptions({ recon: ['./'] })).to.be.rejectedWith(Error);
        });
        it('returns the passed options when tamper property is present', () => {
            expect(tamperOptionsResult).to.have.property('tamper');
            expect(tamperOptionsResult.tamper).to.have.length(3);
        });
    });
});
