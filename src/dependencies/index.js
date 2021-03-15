import out from '../out/index.js';
import { BUMP } from '../constants/index.js';

import npmCheck from 'npm-check';

let filtered = [];

const recon = async (options, checker = npmCheck) => {
    let deps = await checker(options).then(deps => {
        return deps.get('packages')
            .map((pkg) => {
                return {
                    'moduleName': pkg.moduleName,
                    'homepage': pkg.homepage,
                    'latest': pkg.latest,
                    'installed': pkg.installed,
                    'packageWanted': pkg.packageWanted,
                    'bump': pkg.bump,
                    'usedInScripts': pkg.usedInScripts,
                    'easyUpgrade': pkg.easyUpgrade,
                };
            })
            .filter(filterDependencies);
    });
    return {
        upgradable: deps,
        filtered: filtered,
    };
};

const filterDependencies = (dep) => {
    let isFiltered = !(dep.easyUpgrade === true ||
        dep.bump === BUMP.null ||
        dep.bump === BUMP.nonSemver);
    if (isFiltered) {
        filtered.push(dep);
    }
    return isFiltered;
};

export default {
    recon,
}