import out from '../out/index.js';
import { BUMP } from '../constants/index.js';

import npmCheck from 'npm-check';

const recon = async (options, checker = npmCheck) => {
    let filtered = [], upgradable = [];
    let allDeps = await checker(options).then(deps => {
        return deps.get('packages')
            .map((pkg) => {
                return {
                    'moduleName': pkg.moduleName,
                    'homepage': pkg.homepage,
                    'specified': pkg.packageJson,
                    'latest': pkg.latest,
                    'installed': pkg.installed,
                    'packageWanted': pkg.packageWanted,
                    'bump': pkg.bump,
                    'usedInScripts': pkg.usedInScripts,
                    'easyUpgrade': pkg.easyUpgrade,
                };
            })
    });
    allDeps.forEach((dep) => {
        isFiltered(dep) ? filtered.push(dep) : upgradable.push(dep);
    });
    return {
        upgradable,
        filtered
    };
};

const isFiltered = (dep) => {
    return (dep.easyUpgrade === true ||
        dep.bump === BUMP.null ||
        dep.bump === BUMP.nonSemver);
};

export default {
    recon,
}