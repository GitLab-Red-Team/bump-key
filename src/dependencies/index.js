import npmCheck from 'npm-check';
import { BUMP, DEFAULT_VALUES } from '../constants/index.js';
import out from '../out/index.js';

const isFiltered = (dep) => (dep.easyUpgrade === true
    || dep.bump === BUMP.null
    || dep.bump === BUMP.nonSemver);

const filterDependency = (filtered, dep) => {
    out.debug(`Filtered dependency ${dep.moduleName}.`);
    filtered.push(dep);
};

const augmentWithNpmView = async (npmViewAsyncFunc, dependencies) => {
    const promises = dependencies.map(async (dep) => {
        const pkg = `${dep.moduleName}@${dep.installed}`;
        const npmView = await npmViewAsyncFunc(pkg);
        const viewInfo = {};
        viewInfo.bugsUrl = npmView.bugs
            ? npmView.bugs.url
            : DEFAULT_VALUES.MISSING_PROP;
        viewInfo.devDependencies = npmView.devDependencies
            ? Object.entries(npmView.devDependencies).length
            : 0;
        viewInfo.dependencies = npmView.dependencies
            ? Object.entries(npmView.dependencies).length
            : 0;
        viewInfo.author = npmView.author || DEFAULT_VALUES.MISSING_PROP;
        return ({ ...viewInfo, ...dep });
    });
    return Promise.all(promises);
};

const executeNpmCheck = async (options, checker = npmCheck) => {
    const filtered = [];
    const upgradable = [];
    const { recon } = options;
    const allDeps = await checker({ cwd: recon }).then((deps) => deps.get('packages')
        .map((pkg) => {
            out.debug(`Found ${pkg.moduleName}@${pkg.installed}`);
            return ({
                moduleName: pkg.moduleName,
                homepage: pkg.homepage || DEFAULT_VALUES.MISSING_PROP,
                specified: pkg.packageJson,
                latest: pkg.latest,
                installed: pkg.installed,
                packageWanted: pkg.packageWanted,
                bump: pkg.bump,
                usedInScripts: pkg.usedInScripts || false,
                easyUpgrade: pkg.easyUpgrade,
            });
        }));
    allDeps.forEach((dep) => (isFiltered(dep)
        ? filterDependency(filtered, dep)
        : upgradable.push(dep)));
    return {
        upgradable,
        filtered,
    };
};

export default {
    executeNpmCheck,
    augmentWithNpmView,
};
