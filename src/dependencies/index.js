import npmCheck from 'npm-check';
import { BUMP } from '../constants/index.js';

const isFiltered = (dep) => (dep.easyUpgrade === true
    || dep.bump === BUMP.null
    || dep.bump === BUMP.nonSemver);

const recon = async (options, checker = npmCheck) => {
    const filtered = [];
    const upgradable = [];
    const allDeps = await checker(options).then((deps) => deps.get('packages')
        .map((pkg) => ({
            moduleName: pkg.moduleName,
            homepage: pkg.homepage,
            specified: pkg.packageJson,
            latest: pkg.latest,
            installed: pkg.installed,
            packageWanted: pkg.packageWanted,
            bump: pkg.bump,
            usedInScripts: pkg.usedInScripts,
            easyUpgrade: pkg.easyUpgrade,
        })));
    allDeps.forEach((dep) => (isFiltered(dep) ? filtered.push(dep) : upgradable.push(dep)));
    return {
        upgradable,
        filtered,
    };
};

export default {
    recon,
};
