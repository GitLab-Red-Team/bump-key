# bump-key

Tamper a lock file replacing a legitimate dependency with a malicious one

Example:

```bash
# clone the repository
git clone <repo_uri>
# build the tooling
npm run build
# install the tool globally
npm i -g . 
# output help information
bumpkey -h
# tamper a lock file replacing a legitimate dependency with a malicious one
bumpkey --lockfile <some_path> --target <dependency_name@version> --replacement <dependency_name@version>
# install dependencies from the tampered lock file
npm i --from-lock-file
yarn install --freeze-lockfile
```

#### Contributing

Run tests, watching for changes:

```bash
npm run test -- --watchAll
```

