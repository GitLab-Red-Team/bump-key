import path from 'path';
import fs from 'fs';
import util from 'util';
import out from '../out/index.js';
import common from '../common/index.js';
import { FILES } from '../constants/index.js';

const readFile = util.promisify(fs.readFile);

const readPackageLock = async (filePath, fileReader = readFile) => {
    const buffer = await fileReader(path.join(filePath, FILES.PACKAGELOCK), 'utf8');
    return buffer ? JSON.parse(buffer) : {};
};

const tamperPackage = (tamperOptions, data) => {
    const result = Object.assign(data);
    const depName = tamperOptions[1];
    const updatedResolved = tamperOptions[2];
    if (!result.packages[depName]) throw new Error(`Dependency ${depName} not found...`);
    result.packages[depName].resolved = updatedResolved;
    return result;
};

const start = (options) => {
    common.validateOptions(options, 'tamper')
        .then(() => readPackageLock(options.tamper[0]))
        .then((pkgLock) => tamperPackage(options.tamper, pkgLock))
        .catch(out.warn);
};

export default {
    start,
    readPackageLock,
    updatePackage: tamperPackage,
};
