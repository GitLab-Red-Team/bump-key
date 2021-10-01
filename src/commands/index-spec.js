import {
    describe, beforeEach, afterEach, it,
} from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import commands from './index.js';

describe('commands - npm view', () => {
    let sandbox;
    let shellCommandSpy;
    beforeEach(async () => {
        sandbox = sinon.createSandbox();
        shellCommandSpy = sandbox.spy();
        await commands.npmView('chalk@latest', shellCommandSpy);
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('executes an npm view command properly', () => {
        expect(shellCommandSpy.callCount).to.eql(1);
        expect(shellCommandSpy.calledWith('npm view --json chalk@latest')).to.eql(true);
    });
});
