import child_process from 'child_process';

import { PATHS } from '../constants/index.js';

const execShellCommand = (cmd) => {
    const exec = child_process.exec;
    return new Promise((resolve, reject) => {
        exec(`${PATHS.bin}/${cmd}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout? JSON.parse(stdout) : stderr);
        });
    });
}

const commands = {
    'npmView': (pkg) => {
        return execShellCommand(`npm view --json ${pkg}`);
    }
};

export default commands;