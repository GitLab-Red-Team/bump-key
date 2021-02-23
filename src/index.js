#!/usr/bin/env node
import * as init from './initialization/init';
import reader from './file-io/';
import pathing from './file-io';
import { FILES } from './constants/index';

import yargs from 'yargs';

let options = init.setOptions(yargs);

let path = pathing.buildPath(options.root, FILES.PACKAGE)

reader.readPackageJSON(path)
    .then((data) => {
        console.log(data);
    }).catch((err) => {
        throw err;
    });