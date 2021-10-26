import {
    afterEach,
    beforeEach,
    describe,
    it,
} from 'mocha';
import { expect } from 'chai';
import format from './index.js';

describe('format', () => {
    let exampleDependency;
    let exampleOutput;
    let result;
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
        result = format.dependency(exampleDependency);
    });
    afterEach(() => {
        exampleDependency = null;
    });
    it('should format dependency objects into strings', () => {
        expect(result).to.eql(exampleOutput);
    });
    it('should reject when invalid parameters are given', () => {
        expect(() => format.dependency(undefined)).throws(Error);
    });
});
