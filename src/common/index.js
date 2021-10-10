const validateOptions = async (options, requiredCmdName) => {
    if (!options || !(options.command === requiredCmdName)) {
        throw new Error(`Options missing for ${requiredCmdName}.  Skipping!`);
    } else {
        return options;
    }
};

export default {
    validateOptions,
};
