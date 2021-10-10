#!/usr/bin/env node
import yargs from 'yargs';
import process from 'process';
import bootstrap from './bootstrap/index.js';
import out from './out/index.js';
import recon from './recon/index.js';
import tamper from './tamper/index.js';
import { SUPPORTED_COMMANDS } from './constants/index.js';

process.on('unhandledRejection', (reason) => {
    out.error(reason.stack);
    process.exit(1);
});

const rawOptions = bootstrap.start(yargs);

const options = bootstrap.parseRawOptions(rawOptions);

if (options.command === SUPPORTED_COMMANDS.RECON) {
    recon.start(options);
}

if (options.command === SUPPORTED_COMMANDS.TAMPER) {
    tamper.start(options);
}
