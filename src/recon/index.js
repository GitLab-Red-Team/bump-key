import dependencies from '../dependencies/index.js';
import commands from '../commands/index.js';
import out from '../out/index.js';
import format from '../format/index.js';
import { BUMP } from '../constants/index.js';

const validateOptions = async (options) => {
    if (!options.recon) {
        throw new Error('No recon options provided.  Skipping recon!');
    } else {
        return options;
    }
}

const doRecon = async (options) => dependencies.executeNpmCheck(options);
const augmentWithNpmView = async (allDeps) => {
    const augmented = await dependencies.augmentWithNpmView(commands.npmView, allDeps.upgradable);
    const augmentedDeps = Object.assign(allDeps);
    augmentedDeps.upgradable = augmented;
    return augmentedDeps;
};
const showOutput = (allDeps) => {
    allDeps.upgradable.forEach((dep) => out.info(format.dependency(dep)));
    return allDeps;
};
const rankUpgradablePackagesByTotalDeps = (allDeps) => {
    allDeps.upgradable.sort((a, b) => {
        const totalDepsA = a.devDependencies + a.dependencies;
        const totalDepsB = b.devDependencies + a.dependencies;
        if (totalDepsA < totalDepsB) {
            return 1;
        }
        return -1;
    });
    return allDeps;
};
const ranksUpgradablePackagesByBump = (allDeps) => {
    allDeps.upgradable.sort((a, b) => {
        if (a.bump === BUMP.major && b.bump !== BUMP.major) {
            return -1;
        }
        return 1;
    });
    return allDeps;
};
const showFilteredDeps = (allDeps) => out.warn(`Filtered ${Object.entries(allDeps.filtered).length} up-to-date dependencies`);

const start = (options) => {
    validateOptions(options)
        .then(doRecon)
        .then(augmentWithNpmView)
        .then(rankUpgradablePackagesByTotalDeps)
        .then(ranksUpgradablePackagesByBump)
        .then(showOutput)
        .then(showFilteredDeps)
        .catch(out.debug);
};

export default {
    start,
};
