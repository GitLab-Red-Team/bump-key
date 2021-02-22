
export const setOptions = (argParser) => {
    return argParser()
        .option("l",
            {
                alias: "lockfile",
                describe: "Path to the lock file",
                type: "string",
                demandOption: false
            })
        .argv;
};