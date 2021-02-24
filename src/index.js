#!/usr/bin/env node
import * as init from './initialization/init';
import * as reader from './file-io/reader';
import * as out from './out';

import yargs from 'yargs';

process.on('unhandledRejection', (reason) => {
    out.error(`Unhandled promise rejection: ${reason}`);
});

let options = init.setOptions(yargs);

reader.readPackageJSON(options.root)
    .then((packageJson) => {
        out.info(`Target: ${packageJson.name} v${packageJson.version}`);
    }).catch((err) => {
        throw err;
    });