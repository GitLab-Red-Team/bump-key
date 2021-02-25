import npmCheck from 'npm-check';

export const showOutdated = async (options) => {
    return npmCheck(options);
};