import commands from './index.js';

import {expect} from 'chai';

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