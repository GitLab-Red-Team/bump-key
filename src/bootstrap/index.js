import process from 'process';
import console from 'console';
import chalk from 'chalk';
import util from 'util';
import fs from 'fs';
import { BANNER, SUPPORTED_COMMANDS, FILES } from '../constants/index.js';
import out from '../out/index.js';

const readFile = util.promisify(fs.readFile);

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
    .argv;

const getVersionNumber = async (_fileReader = readFile) => {
    const buffer = await _fileReader(`./${FILES.CHANGELOG}`, 'utf8');
    return /\[.*\]/.exec(buffer)[0];
};

const showBanner = (version) => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log(`   ${chalk.keyword('purple').bgKeyword('orange')(`   ~~~ bump-key ${version} - GitLab Red Team ~~~   \n\n`)}`);
};

const parseRawReconOptions = (cmdOptions) => {
    if (!cmdOptions) throw new Error('Invalid command options provided');
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

const parseRawOptions = (rawOptions) => (
    rawOptions._[0] === SUPPORTED_COMMANDS.RECON
        ? parseRawReconOptions(rawOptions)
        : parseRawTamperOptions(rawOptions)
);

const start = async (argParser,
    _rawOptionsParser = parseRawReconOptions,
    shouldShowBanner = true) => {
    if (shouldShowBanner) {
        showBanner(await getVersionNumber(readFile));
    }
    const cmdOptions = setOptions(argParser);
    out.init(cmdOptions.debug);
    out.debug('Debug mode enabled...');
    out.debug(`Command options recieved: \n${JSON.stringify(cmdOptions, null, 2)}`);
    return _rawOptionsParser(cmdOptions);
};

export default {
    getVersionNumber,
    start,
    parseRawReconOptions,
    parseRawTamperOptions,
    parseRawOptions,
};
