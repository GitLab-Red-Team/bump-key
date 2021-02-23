import * as path from 'path';

export const buildPath = (root) => {
    return path.resolve(root, 'package.json')
};