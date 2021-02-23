import readJson from 'read-package-json';
import { FILES } from '../constants';

import path from 'path';


export const readPackageJSON = (rootDir) => {
    return new Promise((resolve, reject) => {
        if (!rootDir) reject('No path given!');
        let packageJsonPath = path.join(rootDir, FILES.PACKAGE);
        readJson(packageJsonPath, null, true, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}