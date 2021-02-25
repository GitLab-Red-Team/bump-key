import npmCheck from 'npm-check';

export const recon = async (options) => {
    return npmCheck(options).then(deps => {
        return deps.get('packages')
            .map(dep => {
                return {
                    'moduleName': dep.moduleName,
                    'homepage': dep.homepage,
                    'latest': dep.latest,
                    'installed': dep.installed,
                    'packageWanted': dep.packageWanted,
                    'bump': dep.bump,
                    'usedInScripts': dep.usedInScripts
                };
        });
    });
};