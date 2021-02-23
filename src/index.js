#!/usr/bin/env node
import * as init from './initialization/init';
import * as reader from './file-io/reader';

import yargs from 'yargs';

let options = init.setOptions(yargs);

reader.readPackageJSON(options.root)
    .then((data) => {
        console.log(data);
    }).catch((err) => {
        throw err;
    });