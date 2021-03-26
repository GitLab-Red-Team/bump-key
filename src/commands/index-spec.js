import {
    describe, beforeEach, afterEach, it,
} from 'mocha';
import { expect } from 'chai';
import commands from './index.js';

describe('commands - npm view', () => {
    let commandResults;
    beforeEach(async () => {
        commandResults = await commands.npmView('chalk@latest');
    });
    afterEach(() => {
        commandResults = null;
    });
    it('executes an npm view command returning dev dependencies', () => {
        expect(commandResults.devDependencies.length).not.to.eql(0);
    });
    it('executes an npm view command returning prod dependencies', () => {
        expect(commandResults.dependencies.length).not.to.eql(0);
    });
});
