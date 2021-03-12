#!/usr/bin/env node
import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import { BANNER } from './constants/index.js';

import yargs from 'yargs';
import chalk from 'chalk';

process.on('unhandledRejection', (reason) => {
    out.error(`Unhandled promise rejection: ${reason}`);
});

let cmdOptions = init.setOptions(yargs);

let depOptions = {
    cwd: cmdOptions.root
};

console.log(chalk.keyword('orange').bold(BANNER));
console.log(chalk.keyword('purple').bgKeyword('orange')('v1.0.0 - GitLab Red Team'));
console.log();

out.info(`Listing upgradable dependencies for ${cmdOptions.root}...`)

dependencies.recon(depOptions)
    .then((deps) => {
        deps.forEach((dep) => {
            out.info(`${dep.moduleName} * bump = ${dep.bump} * `);
        });
    });
