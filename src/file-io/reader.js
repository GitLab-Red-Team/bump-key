import readJson from 'read-package-json';
import { FILES } from '../constants';

import * as path from 'path';


export const readPackageJSON = (rootDir) => {
    return new Promise((resolve, reject) => {
        if (rootDir === undefined || rootDir === '')
            reject('No path was given!');
        let packageJson = path.join(rootDir, FILES.PACKAGE);
        readJson(packageJson, null, true, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}