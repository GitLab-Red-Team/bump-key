import process from 'process';
import console from 'console';
import chalk from 'chalk';
import { BANNER } from '../constants/index.js';
import out from '../out/index.js';

//ref:  https://yargs.js.org/docs/#api-reference-optionskey-opt
const setOptions = (argParser) => argParser(process.argv.slice(2))
    .options({
        help: {
            alias: 'h',
        },
        recon: {
            alias: 'r',
            description: 'Perform recon to find viable targets for tampering',
            required: false,
            requiresArg: true,
            type: 'string',
            nargs: 1,
        },
        tamper: {
            alias: 't',
            description: 'Tampers a lock file.  Provide positional arguments for the path to the target lock file, the integrrity hash of the targeted dependency in the lock file, and the URL of the replacement tar file.',
            required: false,
            type: 'array',
            requiresArg: true,
            nargs: 3,
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
