/* eslint-disable camelcase */
import child_process from 'child_process';

import { PATHS } from '../constants/index.js';

const execShellCommand = (cmd) => new Promise((resolve, reject) => {
    child_process.exec(`${PATHS.bin}/${cmd}`, (error, stdout, stderr) => {
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
