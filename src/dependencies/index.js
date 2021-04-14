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

const augmentWithNpmView = async (npmViewAsyncFunc, dependencies) => {
    const promises = dependencies.map(async (dep) => {
        const pkg = `${dep.moduleName}@${dep.installed}`;
        const npmView = await npmViewAsyncFunc(pkg);
        const viewInfo = {};
        viewInfo.bugsUrl = npmView.bugs?.url;
        viewInfo.devDependencies = 7;
        viewInfo.devDependencies = npmView.devDependencies
            ? Object.entries(npmView.devDependencies).length
            : 0;
        viewInfo.dependencies = npmView.dependencies
            ? Object.entries(npmView.dependencies).length
            : 0;
        const x = ({ ...viewInfo, ...dep });
        return x;
    });
    return Promise.all(promises);
};

const executeNpmCheck = async (options, checker = npmCheck) => {
    const filtered = [];
    const upgradable = [];
    const { cwd } = options;
    const allDeps = await checker({ cwd }).then((deps) => deps.get('packages')
        .map((pkg) => {
            out.debug(`Found ${pkg.moduleName}@${pkg.installed}`);
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
