/* eslint-disable import/no-duplicates */
import {
    beforeEach, describe, it,
} from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import tamper from './index.js';

describe('tamper', () => {
    describe('readPackageLock', () => {
        let fileReaderSpy;
        const dir = '/opt/somedir';
        beforeEach(async () => {
            fileReaderSpy = sinon.spy();
            await tamper.readPackageLock(dir, fileReaderSpy);
        });
        it('makes proper calls to the file reader function', async () => {
            expect(fileReaderSpy.callCount).to.equal(1);
            expect(fileReaderSpy.args[0][0]).to.equal(`${dir}/package-lock.json`);
            expect(fileReaderSpy.args[0][1]).to.equal('utf8');
        });
    });
});
