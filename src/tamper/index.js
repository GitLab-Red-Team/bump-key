import out from '../out/index.js';

const validateOptions = async (options) => {
    out.warn(JSON.stringify(options));
    if (('tamper' in options) === false) {
        throw new Error('No tamper options provided.  Skipping!');
    } else {
        return options;
    }
};

const start = (options) => options;

export default {
    start,
    validateOptions,
};
