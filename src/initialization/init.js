
export const setOptions = (argParser) => {
    return argParser()
        .option("p",
            {
                alias: "path",
                describe: "Path to the lock file",
                type: "string",
                demandOption: true
            });
};