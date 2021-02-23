import * as path from 'path';

export const buildPath = (root, file) => {
    return path.resolve(root, file);
};