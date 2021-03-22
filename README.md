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
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -r, --root     The root directory of the targeted project           [required]
```

#### Contributing

To run tests:

```bash
npm run test
```

From the root directory of the cloned repository, you can run and test the tool without installing it globally.  This method of execution can be used from the command line and is also handy to plug into your development tool of choice for debugging purposes:

```
node ./src/index.js <options>
```

