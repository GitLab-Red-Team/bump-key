#!/usr/bin/env node
import * as init from './initialization/init';
import * as out from './out';
import * as dependencies from './dependencies';

import yargs from 'yargs';

process.on('unhandledRejection', (reason) => {
    out.error(`Unhandled promise rejection: ${reason}`);
});

let cmdOptions = init.setOptions(yargs);

let depOptions = {
    cwd: cmdOptions.root
};

dependencies.recon(depOptions)
    .then((deps) => {
        console.log(deps);
    });
