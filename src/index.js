#!/usr/bin/env node
import yargs from 'yargs';
import process from 'process';
import bootstrap from './bootstrap/index.js';
import out from './out/index.js';
import recon from './recon/index.js';
import tamper from './tamper/index.js';

process.on('unhandledRejection', (reason) => {
    out.error(reason.stack);
    process.exit(1);
});

bootstrap.start(yargs)
    .then(recon.start)
    .then(tamper.start);
