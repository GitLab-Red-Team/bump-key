import * as pathing from './pathing'
import { FILES } from '../constants'
import path from 'path';

describe('pathing', () => {
    describe('buildPath', () => {
        let root, packageJsonPath;
        beforeEach(() => {
            root = process.cwd() + '/test-data/';
            packageJsonPath = pathing.buildPath(root);
        });
        test('builds a package.json path', () => {
            expect(packageJsonPath).toEqual(path.resolve(root, FILES.PACKAGE));
        });
    });
});