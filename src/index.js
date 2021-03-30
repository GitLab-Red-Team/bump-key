#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import process from 'process';
import console from 'console';

import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import { BANNER } from './constants/index.js';

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

const enhanceDependencyData = async (allDeps) => {
    allDeps.upgradable.forEach((dep) => {
       out.info(dep.moduleName);
    });
};

const formatOutput = async (dep) => {
    out.info(`${dep.installed} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage || 'NA'}
    * used in script: ${dep.usedInScripts || false}
    * top-level dev dependencies: ${dep.topLevelDevDeps}
    * top-level prod dependencies:  ${dep.topLevelProdDeps}`
    );
};

const doRecon = async (depOptions) => await dependencies.recon(depOptions);

const outputResults = (allDeps) => {
    if (allDeps.filtered?.length > 0) {
        out.warn(`Filtered ${allDeps.filtered.length} ignorable dependencies...`)
    } else {
        out.warn('No dependencies filtered...')
    }
    if (allDeps.upgradable?.length > 0) {
        allDeps.upgradable.forEach(formatOutput);
    } else {
        out.warn('No upgradable dependencies found. Exiting.')
    }
};

initialize()
    .then(doRecon)
    .then(enhanceDependencyData)
    //.then(outputResults)
    .catch(out.error);


