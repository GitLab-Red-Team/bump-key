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
        root: {
            alias: 'r',
            description: 'The root directory of the targeted project',
            requiresArg: true,
            required: true,
        },
        debug: {
            alias: 'd',
            description: 'Enables additional output to aid in debugging',
            requiresArg: false,
            required: false,
        },
    })
    .argv;

const start = async (argParser) => {
    console.log(chalk.keyword('purple').bold(BANNER));
    console.log(`   ${chalk.keyword('purple').bgKeyword('orange')('   ~~~ bump-key v0.0.1 - GitLab Red Team ~~~   \n\n')}`);
    const cmdOptions = setOptions(argParser);
    out.init(cmdOptions.debug);
    if (cmdOptions.debug) out.debug('Debug mode enabled...');
    out.info(`Analyzing package.json at ${cmdOptions.root}`);
    return {
        cwd: cmdOptions.root,
        debug: cmdOptions.debug,
    };
};

export default {
    start,
};
