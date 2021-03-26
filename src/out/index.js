import console from 'console';

import chalk from 'chalk';

const log = (prefix, color, txt) => {
    txt.map((entry) => console.log(color(`${prefix} ${entry}`)));
};

const info = (...txt) => {
    log('[*]', chalk.greenBright.bold, txt);
};

const warn = (...txt) => {
    log('[-]', chalk.keyword('orange'), txt);
};

const error = (...txt) => {
    log('[!]', chalk.red.bold, txt);
};

export default {
    info,
    warn,
    error,
};
