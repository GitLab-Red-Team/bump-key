import path from 'path';
import fs from 'fs';
import util from 'util';
import out from '../out/index.js';
import common from '../common/index.js';

const readFile = util.promisify(fs.readFile);

const readPackageLock = async (filePath, fileReader = readFile) => {
    const buffer = await fileReader(path.join(filePath, 'package-lock.json'), 'utf8');
    return buffer ? JSON.parse(buffer.toString()) : {};
};

const start = (options) => {
    common.validateOptions(options, 'tamper')
        .then(() => readPackageLock(options.tamper[0]))
        .then((data) => out.warn(data.name))
        .catch(out.warn);
};

export default {
    start,
    readPackageLock,
};
