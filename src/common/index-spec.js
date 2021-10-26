/* eslint-disable import/no-duplicates */
import {
    afterEach, beforeEach, describe, it,
} from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import common from './index.js';
import { SUPPORTED_COMMANDS } from '../constants/index.js';

chai.use(chaiAsPromised);

describe('common', () => {
    describe('validateOptions', () => {
        let tamperOptions;
        let tamperOptionsResult;
        beforeEach(async () => {
            tamperOptions = {
                command: SUPPORTED_COMMANDS.TAMPER,
                options: {
                    lockfile: './',
                    package: 'one',
                    replacement: 'two',
                    debug: true,
                },
            };
            tamperOptionsResult = await common
                .validateOptions(tamperOptions, SUPPORTED_COMMANDS.TAMPER);
        });
        afterEach(() => {
            tamperOptions = undefined;
            tamperOptionsResult = undefined;
        });
        it('invalidates when relavent property is missing', async () => {
            await expect(common.validateOptions({ recon: ['./'] }, 'missingPropName')).to.be.rejectedWith(Error);
        });
        it('invalidated when the expected property name is not passed', async () => {
            await expect(common.validateOptions({ recon: ['./'] })).to.be.rejectedWith(Error);
        });
        it('invalidated when the expected property name is empty', async () => {
            await expect(common.validateOptions({ recon: ['./'] }), '').to.be.rejectedWith(Error);
        });
        it('invalidates when options are undefined', async () => {
            await expect(common.validateOptions(undefined)).to.be.rejectedWith(Error);
        });
        it('returns the passed options when expected property is present and set', () => {
            expect(tamperOptionsResult.command).to.eql(SUPPORTED_COMMANDS.TAMPER);
            expect(tamperOptionsResult.options).not.to.eql(undefined);
        });
    });
});
