#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import process from 'process';
import console from 'console';

import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import {BANNER} from './constants/index.js';
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

const addNpmViewDataToUpgradable = async (allDeps) => {
    for (let i = 0; i < allDeps.upgradable.length; i++) {
        let nameVersion = `${allDeps.upgradable[i].moduleName}@${allDeps.upgradable[i].installed}`;
        let npmView = await commands.npmView(nameVersion);
        allDeps.upgradable[i].bugsUrl = npmView.bugs.url;
        allDeps.upgradable[i].dependencies = Object.entries(npmView.dependencies).length;
        allDeps.upgradable[i].devDependencies = Object.entries(npmView.devDependencies).length;
    }
    return allDeps;
}

const formatOutput = (dep) => {
    let nameVersion = `${dep.moduleName}@${dep.installed}`;
    out.info(`${nameVersion} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage || 'NA'}
    * bugs: ${dep.bugsUrl || 'NA'}
    * used in script: ${dep.usedInScripts || false}
    * devDependencies: ${dep.devDependencies}
    * dependencies: ${dep.dependencies}`
    );
};

const doRecon = async (options) => await dependencies.recon(options);
const showOutput = (allDeps) => {
    allDeps.upgradable.forEach(formatOutput);
    return allDeps;
};
const rankUpgradableDeps = (allDeps) => {
    return allDeps;
};
const showFilteredDeps = (allDeps) =>
    out.warn(`Filtered ${Object.entries(allDeps.filtered).length} up-to-date dependencies`);

initialize()
    .then(doRecon)
    .then(addNpmViewDataToUpgradable)
    .then(showOutput);
    //.then(rankUpgradableDeps)
    //.then(showOutput)
    //.then(showFilteredDeps);


