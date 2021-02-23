#!/usr/bin/env node
import * as init from './initialization/init';
import * as reader from './file-io/reader';
import * as out from './out';

import yargs from 'yargs';

let options = init.setOptions(yargs);

reader.readPackageJSON(options.root)
    .then((packageJson) => {
        out.info(packageJson.name);
    }).catch((err) => {
        throw err;
    });