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

const options = bootstrap.start(yargs);

if (options.recon) {
    recon.start(options);
}

if (options.tamper) {
    tamper.start(options);
}
