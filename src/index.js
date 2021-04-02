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

const getNpmViewCmdResults = async (dep) =>
    await commands.npmView(`${dep.moduleName}@${dep.installed}`);

const formatOutput = async (dep) => {
    let nameVersion = `${dep.moduleName}@${dep.installed}`;
    let view = await commands.npmView(nameVersion);
    out.info(`${nameVersion} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage || 'NA'}
    * bugs: ${view.bugs?.url || 'NA'}
    * used in script: ${dep.usedInScripts || false}
    * top-level dev dependencies: ${view.devDependencies ? Object.entries(view.devDependencies).length : 0}
    * top-level prod dependencies:  ${view.dependencies ? Object.entries(view.dependencies).length : 0}`
    );
};

const doRecon = async (options) => await dependencies.recon(options);


initialize()
    .then(doRecon)
    .then((allDeps) => {
        allDeps.upgradable.forEach(formatOutput);
        return allDeps.filtered;
    })
    .then((filtered) => out.warn(`Filtered ${Object.entries(filtered).length} up-to-date dependencies`));


