#!/usr/bin/env node
import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import {BANNER} from './constants/index.js';
import commands from './commands/index.js';

import yargs from 'yargs';
import chalk from 'chalk';

process.on('unhandledRejection', (reason) => {
    out.error(`Unhandled promise rejection: ${reason}`);
});

let cmdOptions = init.setOptions(yargs);

let depOptions = {
    cwd: cmdOptions.root
};
const printBanner = () => {
    console.log(chalk.keyword('orange').bold(BANNER));
    console.log(chalk.keyword('purple').bgKeyword('orange')('~~~ bump-key v0.0.1 - GitLab Red Team ~~~'));
    console.log();
};

const processDependency = async (dep) => {
    let installed = `${dep.moduleName}@${dep.installed}`;
    let view = await commands.npmView(installed);
    out.info(`${installed} 
    * bump to latest: ${dep.bump}
    * top-level dev dependencies: ${view.devDependencies ? Object.entries(view.devDependencies).length : 0}
    * top-level prod dependencies:  ${view.dependencies ? Object.entries(view.dependencies).length : 0}`
    );
};

printBanner();
out.info(`Listing upgradable dependencies for ${cmdOptions.root}`);
let deps = await dependencies.recon(depOptions);
deps.forEach(processDependency);

