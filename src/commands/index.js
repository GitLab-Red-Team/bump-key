import * as cp from 'child_process';

import { PATHS } from '../constants/index.js';

const execShellCommand = (cmd) => new Promise((resolve, reject) => {
    cp.child_process.exec(`${PATHS.bin}/${cmd}`, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }
        resolve(stdout ? JSON.parse(stdout) : stderr);
    });
});

const commands = {
    npmView: async (pkg) => execShellCommand(`npm view --json ${pkg}`),
};

export default commands;
