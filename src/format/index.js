import out from '../out/index.js';

const dependency = (dep) => {
    const nameVersion = `${dep.moduleName}@${dep.installed}`;
    out.info(`${nameVersion} 
    * bump to latest: ${dep.bump}
    * specified: ${dep.specified}
    * wanted: ${dep.packageWanted}
    * latest version: ${dep.latest}
    * url: ${dep.homepage}
    * author: ${dep.author}
    * bugs: ${dep.bugsUrl}
    * used in script: ${dep.usedInScripts}
    * devDependencies: ${dep.devDependencies}
    * dependencies: ${dep.dependencies}`);
};

export default {
    dependency,
};
