import process from 'process';

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

export default {
    setOptions,
};
