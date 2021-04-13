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

const addNpmViewDataToUpgradables = async (allDeps) => {
    const promises = allDeps.upgradable.map(async (dep) => {
        const pkg = `${dep.moduleName}@${dep.installed}`;
        const npmView = await commands.npmView(pkg);
        dep.bugsUrl = npmView.bugs?.url;
        dep.devDependencies = npmView.devDependencies
            ? Object.entries(npmView.devDependencies).length
            : 0;
        dep.dependencies = npmView.dependencies
            ? Object.entries(npmView.dependencies).length
            : 0;
        return dep;
    });
    const results = await Promise.all(promises);
    Object.assign({}, results, allDeps.upgradable)
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

const doRecon = async (options) => await dependencies.executeNpmCheck(options);
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
    .then(addNpmViewDataToUpgradables)
    .then(showOutput);
    //.then(rankUpgradableDeps)
    //.then(showOutput)
    //.then(showFilteredDeps);


