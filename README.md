[![pipeline status](https://gitlab.com/gitlab-red-team/attack-tools/bump-key/badges/master/pipeline.svg)](https://gitlab.com/gitlab-red-team/attack-tools/bump-key/-/commits/master)

# bump-key

Tamper a lock file replacing a legitimate dependency with a malicious one

#### Installation

Installation and execution requires NodeJS version 15 or later.

```bash
# clone the repository
git clone <repo_uri>
# build the tooling
npm run build
# install the tool globally
npm run install-global
# output help information
bump-key -h
```

#### Usage

```
Options:
  -h, --help                                                           [boolean]
  -v, --version                                                        [boolean]
  -r, --recon    Default option if no other parameters are given
  -t, --tamper   Specify the path to the lock file to tamper along with a SHA1
  -d, --debug    Enables additional output to aid in debugging
```

#### Contributing

This project uses [AngularJS commit message formatting](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) to support automatic semantic versioning releases using [semantic-release](https://github.com/semantic-release/semantic-release).  For an MR to be accepted, each commit message must follow this format.

To run tests:

```bash
npm run test
```

To watch and rerun changed tests only:
```bash
npm run test:watch
```

From the root directory of the cloned repository, you can run and test the tool without installing it globally.  This method of execution can be used from the command line and is also handy to plug into your development tool of choice for debugging purposes:

```
node ./src/index.js <options>
```

