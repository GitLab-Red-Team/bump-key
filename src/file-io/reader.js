import * as fs from 'fs';

export const readJSON = (path) => {
    if (path === undefined || path === "") throw "No path was given!";
    let raw = fs.readFileSync(path);
    return JSON.parse(raw);
}