import path from 'path';
import fs from 'fs';
import util from 'util';
import out from '../out/index.js';
import common from '../common/index.js';

const asyncReadFile = util.promisify(fs.readFile);

const readPackageLock = (filePath, fileReader = asyncReadFile) => fileReader(path.join(filePath, 'package-lock.json'), 'utf8');

const start = (options) => {
    common.validateOptions(options, 'tamper')
        .then(readPackageLock(options.path))
        .catch(out.debug);
};

export default {
    start,
    readPackageLock,
};
