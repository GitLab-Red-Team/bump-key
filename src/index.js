#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import process from 'process';
import console from 'console';

import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import { BANNER } from './constants/index.js';
import commands from './commands/index.js';

process.on('unhandledRejection', (reason) => {
    out.error(reason.stack);
    process.exit(1);
});

const initialize = async () => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log('   ' + chalk.keyword('purple').bgKeyword('orange')
        ('   ~~~ bump-key v0.0.1 - GitLab Red Team ~~~   \n\n'));
    let cmdOptions = init.setOptions(yargs);
    out.init(cmdOptions.debug);
    if (cmdOptions.debug) out.debug('Debug mode enabled...');
    out.info(`Analyzing package.json at ${cmdOptions.root}`);
    return {
        cwd: cmdOptions.root,
        debug: cmdOptions.debug,
    };
};

const formatOutput = async (dep) => {
    let view = await commands.npmView(`${dep.moduleName}@${dep.installed}`);
    out.info(`${dep.installed} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage || 'NA'}
    * used in script: ${dep.usedInScripts || false}
    * top-level dev dependencies: ${Object.entries(view.devDependencies).length}
    * top-level prod dependencies:  ${Object.entries(view.dependencies).length}`
    );
};

const doRecon = async (depOptions) => await dependencies.recon(depOptions);

initialize()
    .then(doRecon)
    .then((allDeps) => allDeps.upgradable.forEach(formatOutput))


