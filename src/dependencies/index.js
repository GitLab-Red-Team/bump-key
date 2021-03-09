import npmCheck from 'npm-check';

export const recon = async (options) => {
    return npmCheck(options).then(deps => {
        return deps.get('packages')
            .map((pkg) => {
                return {
                    'moduleName': pkg.moduleName,
                    'homepage': pkg.homepage,
                    'latest': pkg.latest,
                    'installed': pkg.installed,
                    'packageWanted': pkg.packageWanted,
                    'bump': pkg.bump,
                    'usedInScripts': pkg.usedInScripts
                };
        });
    });
};