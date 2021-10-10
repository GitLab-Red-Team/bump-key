import process from 'process';
import console from 'console';
import chalk from 'chalk';
import { BANNER, SUPPORTED_COMMANDS } from '../constants/index.js';
import out from '../out/index.js';

const defaultRequiredStringOption = {
    required: true,
    requiresArg: true,
    type: 'string',
    nargs: 1,
};

// ref: https://yargs.js.org/docs/#api-reference-optionskey-opt
const setOptions = (argParser) => argParser(process.argv.slice(2))
    .command(SUPPORTED_COMMANDS.RECON, 'Perform reconnaissance to determine potential targets within a project', {
        lockfile: {
            alias: 'l',
            description: 'The path to the target lockfile',
            ...defaultRequiredStringOption,
        },
    })
    .command(SUPPORTED_COMMANDS.TAMPER, 'Tamper a lockfile by supplying target package name and replacement name', {
        lockfile: {
            alias: 'l',
            description: 'The path to the target lockfile',
            ...defaultRequiredStringOption,
        },
        package: {
            alias: 'p',
            description: 'The name of the target package in the lockfile',
            ...defaultRequiredStringOption,
        },
        replacement: {
            alias: 'r',
            description: 'The name of npmjs.org dependency to replace the target',
            ...defaultRequiredStringOption,
        },
    })
    .options({
        help: {
            alias: 'h',
        },
        debug: {
            alias: 'd',
            description: 'Enables additional output to aid in debugging',
            requiresArg: false,
            required: false,
        },
    })
    .argv;

const showBanner = () => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log(`   ${chalk.keyword('purple').bgKeyword('orange')('   ~~~ bump-key v0.0.1 - GitLab Red Team ~~~   \n\n')}`);
};

const parseRawReconOptions = (cmdOptions) => {
    if (!cmdOptions) throw new Error('Invalid command options provided');
    return {
        command: SUPPORTED_COMMANDS.RECON,
        options: {
            lockfile: cmdOptions.lockfile,
        },
    };
};

const start = (argParser, shouldShowBanner = true) => {
    if (shouldShowBanner) showBanner();
    const cmdOptions = setOptions(argParser);
    out.init(cmdOptions.debug);
    out.debug('Debug mode enabled...');
    out.debug(`Command options recieved: \n${JSON.stringify(cmdOptions, null, 2)}`);
    return cmdOptions;
};

export default {
    start,
    parseRawReconOptions,
};
