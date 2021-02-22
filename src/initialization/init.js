
export const setOptions = (argParser) => {
    return argParser(process.argv.slice(2))
        .options({
            root: {
                alias: 'r',
                description: 'The root directory of the targeted project',
                requiresArg: true,
                required: true
            },
        })
        .argv;
};