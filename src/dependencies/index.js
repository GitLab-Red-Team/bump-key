import npmCheck from 'npm-check';
import { BUMP } from '../constants/index.js';
import out from '../out/index.js';

const isFiltered = (dep) => (dep.easyUpgrade === true
    || dep.bump === BUMP.null
    || dep.bump === BUMP.nonSemver);

const filterDependency = (filtered, dep) => {
    out.debug(`Filtered dependency ${dep.moduleName}.`);
    filtered.push(dep);
};

const recon = async (options, checker = npmCheck) => {
    const filtered = [];
    const upgradable = [];
    let {cwd} = options;
    const allDeps = await checker({cwd}).then((deps) => deps.get('packages')
        .map((pkg) => {
            out.debug(`Found ${pkg.moduleName}@${pkg.installed}`)
            return ({
                moduleName: pkg.moduleName,
                homepage: pkg.homepage,
                specified: pkg.packageJson,
                latest: pkg.latest,
                installed: pkg.installed,
                packageWanted: pkg.packageWanted,
                bump: pkg.bump,
                usedInScripts: pkg.usedInScripts,
                easyUpgrade: pkg.easyUpgrade,
            });
        }));
    allDeps.forEach((dep) => (isFiltered(dep) ? filterDependency(filtered, dep) : upgradable.push(dep)));
    return {
        upgradable,
        filtered,
    };
};

export default {
    recon,
};
