import commands from './index.js';

import {expect} from 'chai';

describe('commands', () => {
    let commandResults;
    beforeEach(async () => {
        commandResults = await commands.npmls('npm@latest');
    });
    afterEach(() => {});
    it('executes an arbitrary command async', () => {
        expect(commandResults.length).not.to.eql(0);
    });
});