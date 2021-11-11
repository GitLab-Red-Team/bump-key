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
        packageName: {
            alias: 'p',
            description: 'The name of the target package in the lockfile',
            ...defaultRequiredStringOption,
        },
        replacementName: {
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
    .demandCommand(1)
    .argv;

const showBanner = () => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log(`   ${chalk.keyword('purple').bgKeyword('orange')('   ~~~ bump-key - GitLab Red Team ~~~   \n')}`);
};

const parseRawReconOptions = (cmdOptions) => {
    if (!cmdOptions) throw new Error('Invalid command options provided');
    out.debug(`Parsing raw recon options: ${JSON.stringify(cmdOptions)}`);
    return {
        command: SUPPORTED_COMMANDS.RECON,
        options: {
            lockfile: cmdOptions.lockfile,
            debug: cmdOptions.debug || false,
        },
    };
};

const parseRawTamperOptions = (cmdOptions) => {
    if (!cmdOptions) throw new Error('Invalid command options provided');
    out.debug(`Parsing raw tamper options: ${JSON.stringify(cmdOptions)}`);
    return {
        command: SUPPORTED_COMMANDS.TAMPER,
        options: {
            lockfile: cmdOptions.lockfile,
            packageName: cmdOptions.packageName,
            replacementName: cmdOptions.replacementName,
            debug: cmdOptions.debug || false,
        },
    };
};

const parseRawOptions = (rawOptions) => {
    let options;
    switch (rawOptions._[0]) {
    case SUPPORTED_COMMANDS.RECON:
        options = parseRawReconOptions(rawOptions);
        break;
    case SUPPORTED_COMMANDS.TAMPER:
        options = parseRawTamperOptions(rawOptions);
        break;
    default:
        throw new Error('No supported commands provided.  Use --help for usage information.');
    }
    return options;
};

const start = async (argParser,
    _rawOptionsParser = parseRawOptions,
    shouldShowBanner = true) => {
    if (shouldShowBanner) {
        showBanner();
    }
    const cmdOptions = setOptions(argParser);
    out.init(cmdOptions.debug);
    out.debug('Debug mode enabled...');
    out.debug(`Command options recieved: \n${JSON.stringify(cmdOptions, null, 2)}`);
    return _rawOptionsParser(cmdOptions);
};

export default {
    start,
    parseRawReconOptions,
    parseRawTamperOptions,
    parseRawOptions,
};
