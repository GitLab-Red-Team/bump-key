import format from './index.js';
import {beforeEach, describe, it} from "mocha";
import {expect} from "chai";

describe('bootstrap', () => {
    let exampleDependency, exampleOutput;
    beforeEach(() => {
        exampleDependency = {
            moduleName: 'smarfle',
            homepage: 'https://smarfle.com',
            regError: undefined,
            pkgError: undefined,
            latest: '5.1.9',
            installed: '5.1.0',
            isInstalled: true,
            notInstalled: false,
            packageJson: '^5.1.0',
            devDependency: false,
            usedInScripts: true,
            mismatch: false,
            semverValid: '5.1.0',
            easyUpgrade: false,
            bump: 'patch',
            unused: false,
        };
        exampleOutput = `smarfle@5.1.0 
    * bump to latest: patch
    * specified: undefined
    * wanted: undefined
    * latest version: 5.1.9
    * url: https://smarfle.com
    * author: undefined
    * bugs: undefined
    * used in script: true
    * devDependencies: undefined
    * dependencies: undefined`;
    });
    afterEach(() => {
        exampleDependency = null;
    });
    it('should format dependency objects into strings', () => {
        expect(format.dependency(exampleDependency)).to.eql(exampleOutput);
    });
});