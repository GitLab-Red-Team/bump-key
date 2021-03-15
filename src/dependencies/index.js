import out from '../out/index.js';
import { BUMP } from '../constants/index.js';

import npmCheck from 'npm-check';

const recon = async (options, checker = npmCheck) => {
    return checker(options).then(deps => {
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
};

const filterDependencies = (dep) => {
    let filtered = !(dep.easyUpgrade === true ||
        dep.bump === BUMP.null ||
        dep.bump === BUMP.nonSemver);
    if (filtered) {
        out.warn(`Filtered non-viable dependency ${dep.moduleName}...`)
    }
    return filtered
};

export default {
    recon,
}