import readJson from 'read-package-json';

export const readPackageJSON = (path) => {
    return new Promise((resolve, reject) => {
        if (path === undefined || path === '')
            reject('No path was given!');
        readJson(path, null, true, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}