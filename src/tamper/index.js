import out from '../out/index.js';
import common from '../common/index.js';

const start = (options) => {
    common.validateOptions(options, 'tamper')
        .then(out.warn(JSON.stringify(options)))
        .catch(out.debug);
};

export default {
    start,
};
