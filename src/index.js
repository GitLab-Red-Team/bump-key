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

const rawCommand = bootstrap.start(yargs);
const command = bootstrap.parseRawOptions(rawCommand);

if (command.command === SUPPORTED_COMMANDS.RECON) {
    recon.start(command);
}

if (command.command === SUPPORTED_COMMANDS.TAMPER) {
    tamper.start(command);
}
