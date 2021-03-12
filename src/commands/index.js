import child_process from 'child_process';

import { PATHS } from '../constants/index.js';

const execShellCommand = (cmd) => {
    const exec = child_process.exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout? stdout : stderr);
        });
    });
}

const commands = {
    'npmls': (pkg) => {
        return execShellCommand(`${PATHS.bin}/npm ls --json ${pkg}`);
    }
};

export default commands;