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
    it('executes an arbitrary command async', () => {
        expect(commandResults.devDependencies.length).not.to.eql(0);
    });
});