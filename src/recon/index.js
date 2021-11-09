import dependencies from '../dependencies/index.js';
import commands from '../commands/index.js';
import common from '../common/index.js';
import out from '../out/index.js';
import format from '../format/index.js';
import { BUMP } from '../constants/index.js';

const getNpmCheckDetails = async (command,
    _executeNpmCheck = dependencies.executeNpmCheck) => _executeNpmCheck(command);
const augmentWithNpmView = async (allDeps, _augmentFunc = dependencies.augmentWithNpmView) => {
    const { upgradable } = allDeps;
    const { npmView } = commands;
    const augmentedWithNpmView = await _augmentFunc(
        npmView, upgradable,
    );
    const augmentedDeps = Object.assign(allDeps);
    augmentedDeps.upgradable = augmentedWithNpmView;
    return augmentedDeps;
};
const showOutput = (augmentedDeps) => {
    augmentedDeps.upgradable.forEach((dep) => out.info(format.dependency(dep)));
    return augmentedDeps;
};
const rankUpgradablePackagesByTotalDeps = (augmentedDeps) => {
    augmentedDeps.upgradable.sort((a, b) => {
        const totalDepsA = a.devDependencies + a.dependencies;
        const totalDepsB = b.devDependencies + a.dependencies;
        if (totalDepsA < totalDepsB) {
            return 1;
        }
        return -1;
    });
    return augmentedDeps;
};
const rankUpgradablePackagesByBump = (augmentedDeps) => {
    augmentedDeps.upgradable.sort((a, b) => {
        if (a.bump === BUMP.major && b.bump !== BUMP.major) {
            return -1;
        }
        return 1;
    });
    return augmentedDeps;
};
const showFilteredDeps = (augmentedDeps) => out.warn(`Filtered ${Object.entries(augmentedDeps.filtered).length} up-to-date dependencies`);

const start = (options) => {
    common.validateOptions(options, 'recon')
        .then(getNpmCheckDetails)
        .then(augmentWithNpmView)
        .then(rankUpgradablePackagesByTotalDeps)
        .then(rankUpgradablePackagesByBump)
        .then(showOutput)
        .then(showFilteredDeps)
        .catch(out.error);
};

export default {
    start,
    getNpmCheckDetails,
    augmentWithNpmView,
    rankUpgradablePackagesByTotalDeps,
};
