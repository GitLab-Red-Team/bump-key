import process from 'process';

const setOptions = (argParser) => {
    return argParser(process.argv.slice(2))
        .options({
            help: {
                alias: 'h'
            },
            version: {
                alias: 'v'
            },
            root: {
                alias: 'r',
                description: 'The root directory of the targeted project',
                requiresArg: true,
                required: true
            },
        })
        .argv;
};

export default {
    setOptions,
};