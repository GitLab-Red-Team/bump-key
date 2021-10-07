import path from 'path';
import fs from 'fs';
import util from 'util';
import out from '../out/index.js';
import common from '../common/index.js';
import { FILES } from '../constants/index.js';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const readPackageLock = async (filePath, _logger = out.info, _fileReader = readFile) => {
    const fileLiteralPath = path.join(filePath, FILES.PACKAGELOCK);
    _logger(`Reading existing package lock file ${fileLiteralPath}..`);
    const buffer = await _fileReader(fileLiteralPath, 'utf8');
    return buffer ? JSON.parse(buffer) : {};
};

const writeTamperedPackageLock = async (filePath, pkgLockData,
    _logger = out.info, _fileWriter = writeFile) => {
    const fileLiteralPath = path.join(filePath, FILES.PACKAGELOCK);
    _logger(`Writing tampered data to ${fileLiteralPath}...`);
    await _fileWriter(fileLiteralPath, JSON.stringify(pkgLockData, null, 2));
};

const tamperPackage = async (tamperOptions, data) => {
    const result = Object.assign(data);
    const depName = tamperOptions[1];
    const updatedResolved = tamperOptions[2];
    if (!result.dependencies[depName]) throw new Error(`Dependency ${depName} not found...`);
    result.dependencies[depName].resolved = updatedResolved;
    return result;
};

const getTamperedPkgDetails = async (tamperOptions, _logger = out.info) => {
    // execute npm view command to get resolved url and integrity hash

};

const start = (options) => {
    common.validateOptions(options, 'tamper')
        .then(() => readPackageLock(options.tamper[0]))
        .then((pkgLock) => tamperPackage(options.tamper, pkgLock))
        .then((tamperedPkgLock) => writeTamperedPackageLock(options.tamper[0], tamperedPkgLock))
        .catch(out.error);
};

export default {
    start,
    readPackageLock,
    writeTamperedPackageLock,
    tamperPackage,
};
