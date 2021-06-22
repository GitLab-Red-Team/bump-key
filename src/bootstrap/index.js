import process from 'process';
import console from 'console';
import chalk from 'chalk';
import { BANNER } from '../constants/index.js';
import out from '../out/index.js';

const setOptions = (argParser) => argParser(process.argv.slice(2))
    .options({
        help: {
            alias: 'h',
        },
        version: {
            alias: 'v',
        },
        recon: {
            alias: 'r',
            description: 'Default option if no other parameters are given',
            required: false,
            requiredArg: true,
        },
        tamper: {
            alias: 't',
            description: 'Specify the path to the lock file to tamper along with a SHA1',
            required: false,
            requiredArg: true,
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

const start = async (argParser, shouldShowBanner = true) => {
    if (shouldShowBanner) showBanner();
    const cmdOptions = setOptions(argParser);
    out.init(cmdOptions.debug);
    if (cmdOptions.debug) out.debug('Debug mode enabled...');
    out.info(`Analyzing package.json at ${cmdOptions.root}`);
    return {
        debug: cmdOptions.debug,
        recon: cmdOptions.recon,
        tamper: cmdOptions.tamper,
    };
};

export default {
    start,
};
