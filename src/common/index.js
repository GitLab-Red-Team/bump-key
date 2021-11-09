const validateOptions = async (options, requiredCmdName) => {
    if (!options || !requiredCmdName || !(options.command === requiredCmdName)) {
        throw new Error(`Options missing for ${requiredCmdName}.  Skipping!`);
    } else {
        return options;
    }
};

export default {
    validateOptions,
};
