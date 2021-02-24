import readJson from 'read-package-json';
import { FILES } from '../constants';

import path from 'path';
import fs from 'fs';


export const readPackageJSON = (rootDir) => {
    return new Promise((resolve, reject) => {
        if (!rootDir) reject('No path given!');
        let absPath = path.resolve(rootDir, FILES.PACKAGE)
        if (!fs.existsSync(absPath))
            reject(`No package.json found at ${absPath}!`)
        readJson(absPath, null, true, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}