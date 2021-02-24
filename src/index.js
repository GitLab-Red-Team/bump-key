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
        let devDepCnt = Object.entries(packageJson.devDependencies).length;
        let prodDepCnt = Object.entries(packageJson.dependencies).length;
        let url = packageJson.repository.url;
        out.info(`Target: ${packageJson.name} v${packageJson.version}`);
        url && out.info(`Repository URL: ${url}`);
        out.info(`Production Dependencies: ${prodDepCnt}`);
        out.info(`Development Dependencies: ${devDepCnt}`);
        console.log(packageJson);
    }).catch((err) => {
        throw err;
    });