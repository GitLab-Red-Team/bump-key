#!/usr/bin/env node
import * as init from './initialization/init';

import yargs from 'yargs';

init.setOptions(yargs);

console.log('hello from bumpkey!');