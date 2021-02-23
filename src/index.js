#!/usr/bin/env node
import * as init from './initialization/init';

import yargs from 'yargs';

let options = init.setOptions(yargs);

async

console.log(`hello from bumpkey! path = ${options.root}`);