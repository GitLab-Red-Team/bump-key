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
    out.error(`Unhandled promise rejection: ${reason}`);
});

const initialize = async () => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log('   ' + chalk.keyword('purple').bgKeyword('orange')('   ~~~ bump-key v0.0.1 - GitLab Red Team ~~~   \n\n'));
    let cmdOptions = init.setOptions(yargs);
    out.info(`Analyzing package.json at ${cmdOptions.root}`);
    return {
        cwd: cmdOptions.root,
    };
};

const processDependency = async (dep) => {
    let installed = `${dep.moduleName}@${dep.installed}`;
    let view = await commands.npmView(installed);
    out.info(`${installed} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage ? dep.homepage : 'NA'}
    * used in script: ${dep.usedInScripts ? dep.usedInScripts : false}
    * top-level dev dependencies: ${view.devDependencies ? Object.entries(view.devDependencies).length : 0}
    * top-level prod dependencies:  ${view.dependencies ? Object.entries(view.dependencies).length : 0}`
    );
};

const doRecon = async (depOptions) => dependencies.recon(depOptions);

const outputResults = (allDeps) => {
    if (allDeps.filtered?.length > 0) {
        out.warn(`Filtered ${allDeps.filtered.length} ignorable dependencies...`)
    } else {
        out.warn('No dependencies filtered...')
    }
    if (allDeps.upgradable?.length > 0) {
        allDeps.upgradable.forEach(processDependency);
    } else {
        out.warn('No upgradable dependencies found...')
    }
};

initialize()
    .then(doRecon)
    .then(outputResults);


