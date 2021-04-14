#!/usr/bin/env node
import yargs from 'yargs';
import chalk from 'chalk';
import process from 'process';
import console from 'console';

import init from './initialization/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import {BANNER, BUMP} from './constants/index.js';
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

const formatOutput = (dep) => {
    let nameVersion = `${dep.moduleName}@${dep.installed}`;
    out.info(`${nameVersion} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage}
    * author: ${dep.author}
    * bugs: ${dep.bugsUrl}
    * used in script: ${dep.usedInScripts}
    * devDependencies: ${dep.devDependencies}
    * dependencies: ${dep.dependencies}`
    );
};

const doRecon = async (options) => await dependencies.executeNpmCheck(options);
const augmentWithNpmView = async (allDeps) => {
    let augmented = await dependencies.augmentWithNpmView(commands.npmView, allDeps.upgradable);
    allDeps.upgradable = augmented;
    return allDeps;
};
const showOutput = (allDeps) => {
    allDeps.upgradable.forEach(formatOutput);
    return allDeps;
};
const rankUpgradablePackagesByTotalDeps = (allDeps) => {
    allDeps.upgradable.sort((a, b) => {
        const totalDepsA = a.devDependencies + a.dependencies;
        const totalDepsB = b.devDependencies + a.dependencies;
        if (totalDepsA < totalDepsB) {
            return 1;
        } else {
            return -1;
        }
    });
    return allDeps;
};
const ranksUpgradablePackagesByBump = (allDeps) => {
    allDeps.upgradable.sort((a, b) => {
        if (a.bump === BUMP.major && b.bump !== BUMP.major) {
            return -1;
        } else {
            return 1;
        }
    });
    return allDeps;
}
const showFilteredDeps = (allDeps) =>
    out.warn(`Filtered ${Object.entries(allDeps.filtered).length} up-to-date dependencies`);

initialize()
    .then(doRecon)
    .then(augmentWithNpmView)
    .then(rankUpgradablePackagesByTotalDeps)
    .then(ranksUpgradablePackagesByBump)
    .then(showOutput)
    .then(showFilteredDeps);