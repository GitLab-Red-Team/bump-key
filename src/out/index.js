import console from 'console';

import chalk from 'chalk';

let isInDebugMode = false;

const init = (debugMode) => {
    isInDebugMode = debugMode;
};

const log = (prefix, color, txt) => {
    txt.map((entry) => console.log(color(`${prefix} ${entry}`)));
};

const info = (...txt) => {
    log('[*]', chalk.greenBright.bold, txt);
};

const warn = (...txt) => {
    log('[-]', chalk.keyword('orange'), txt);
};

const debug = (...txt) => {
    isInDebugMode && log('[d]', chalk.keyword('blue'), txt);
};

const error = (...txt) => {
    log('[!]', chalk.red.bold, txt);
};

export default {
    info,
    init,
    warn,
    error,
    debug,
};
