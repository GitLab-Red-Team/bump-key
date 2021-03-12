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
    return !(dep.easyUpgrade === true ||
        dep.bump === null);
};

export default {
    recon,
}