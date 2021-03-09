#!/usr/bin/env node
import init from './initialization/init.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';

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
