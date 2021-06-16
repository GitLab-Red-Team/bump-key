#!/usr/bin/env node

import process from 'process';
import bootstrap from './bootstrap/index.js';
import out from './out/index.js';
import dependencies from './dependencies/index.js';
import {BUMP} from './constants/index.js';
import commands from './commands/index.js';
import format from './format/index.js';

process.on('unhandledRejection', (reason) => {
    out.error(reason.stack);
    process.exit(1);
});

const doRecon = async (options) => await dependencies.executeNpmCheck(options);
const augmentWithNpmView = async (allDeps) => {
    let augmented = await dependencies.augmentWithNpmView(commands.npmView, allDeps.upgradable);
    allDeps.upgradable = augmented;
    return allDeps;
};
const showOutput = (allDeps) => {
    allDeps.upgradable.forEach(format.dependency);
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

bootstrap.start()
    .then(doRecon)
    .then(augmentWithNpmView)
    .then(rankUpgradablePackagesByTotalDeps)
    .then(ranksUpgradablePackagesByBump)
    .then(showOutput)
    .then(showFilteredDeps);