import path from 'path';
import fs from 'fs';
import util from 'util';
import out from '../out/index.js';
import common from '../common/index.js';
import commands from '../commands/index.js';
import { FILES } from '../constants/index.js';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const readPackageLock = async (filePath, _logger = out.info, _fileReader = readFile) => {
    const fileLiteralPath = path.join(filePath, FILES.PACKAGELOCK);
    _logger(`Reading existing package lock file ${fileLiteralPath} for tampering...`);
    const buffer = await _fileReader(fileLiteralPath, 'utf8');
    return buffer ? JSON.parse(buffer) : {};
};

const writeTamperedPackageLock = async (filePath, pkgLockData,
    _logger = out.info, _fileWriter = writeFile) => {
    const fileLiteralPath = path.join(filePath, FILES.PACKAGELOCK);
    _logger(`Writing tampered data to ${fileLiteralPath}...`);
    await _fileWriter(fileLiteralPath, JSON.stringify(pkgLockData, null, 2));
};

const getTamperedPkgView = async (tamperOptions,
    npmViewFunc = commands.npmView, _logger = out.info) => {
    const { replacement } = tamperOptions.options;
    _logger(`Retrieving package info for replacement package ${replacement}...`);
    return npmViewFunc(replacement);
};

const tamperPackage = async (tamperOptions, data, getTamperedPackageFunc = getTamperedPkgView) => {
    const dataCopy = Object.assign(data);
    const packageName = tamperOptions.options.package;
    const replacementView = await getTamperedPackageFunc(tamperOptions);
    const { tarball, integrity } = replacementView.dist;
    if (!dataCopy.dependencies[packageName]) throw new Error(`Dependency ${packageName} not found...`);
    dataCopy.dependencies[packageName].resolved = tarball;
    dataCopy.dependencies[packageName].integrity = integrity;
    return dataCopy;
};

const start = (command) => {
    const { lockfile } = command.options;
    common.validateOptions(command, 'tamper')
        .then(() => readPackageLock(lockfile))
        .then((pkgLock) => tamperPackage(command, pkgLock))
        .then((tamperedPkgLock) => writeTamperedPackageLock(lockfile, tamperedPkgLock))
        .then(() => out.info('Finished tampering lock file...'))
        .catch(out.error);
};

export default {
    start,
    readPackageLock,
    writeTamperedPackageLock,
    tamperPackage,
    getTamperedPkgView,
};
