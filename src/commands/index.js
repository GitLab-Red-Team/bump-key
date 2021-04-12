/* eslint-disable camelcase */
import util from 'util';
import child_process from 'child_process';

const async_cp = util.promisify(child_process.exec);

const execShellCommand = async (cmd) => {
    const { stdout, stderr } = await async_cp(cmd);
    if (stderr) throw stderr;
    return JSON.parse(stdout);
};

const commands = {
    npmView: async (pkg) => execShellCommand(`npm view --json ${pkg}`),
};

export default commands;
