#!/usr/bin/env node
import * as init from './initialization/init';
import * as out from './out';

import yargs from 'yargs';

process.on('unhandledRejection', (reason) => {
    out.error(`Unhandled promise rejection: ${reason}`);
});

let options = init.setOptions(yargs);