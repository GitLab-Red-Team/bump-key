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

process.on('SIGINT', () => {
    out.warn('Received SIGINT. Press Control-D to exit.');
});

const executeSupportedCommand = (parsedOptions) => {
    switch (parsedOptions.command) {
    case SUPPORTED_COMMANDS.RECON:
        recon.start(parsedOptions);
        break;
    case SUPPORTED_COMMANDS.TAMPER:
        tamper.start(parsedOptions);
        break;
    default:
        out.error('No supported commands provided.  Use --help for usage information.');
    }
};

bootstrap.start(yargs)
    .then(executeSupportedCommand);
