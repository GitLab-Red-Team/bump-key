const validateOptions = async (options, requiredPropName) => {
    if (!options || !(requiredPropName in options)) {
        throw new Error(`Options missing for ${requiredPropName}.  Skipping!`);
    } else {
        return options;
    }
};

export default {
    validateOptions,
};
