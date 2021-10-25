## [1.1.1](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/compare/v1.1.0...v1.1.1) (2021-10-25)


### Bug Fixes

* **bootstrap:** get version number from generated changelog ([9a93fa1](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/9a93fa16b0cc20ed17affe6f6f3ef21c6bba73b6))
* **bootstrap:** rawOptionsParser is a dependency of the bootstrap.start function ([725dfaf](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/725dfafb146a1738f9b38853ba139995f2b58c9e))
* **changelog:** add a changelog title ([ff0dd6b](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/ff0dd6bb8337d197eafd45e3b5ee975746769d87))

# [1.1.0](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/compare/v1.0.0...v1.1.0) (2021-10-11)


### Bug Fixes

* **commands:** add helper function to parse readable commands and options ([f46d14a](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/f46d14a57bf944311d9b80563496a96650d7341f))
* **commands:** parse debug options properly ([b558eb6](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/b558eb6d144b28ed71ff5d864767a756d3e27999))
* **commands:** parse tamper options so that they're more readable ([5c98ca4](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/5c98ca40b4289091a4116ed04d96553ba7098a62))
* **commands:** replace conflicting -d switch.  refactor tests for proper hierarchy. ([2ed425e](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/2ed425ed50cdfe788795b2e37a4bf95045051674))
* **getTamperedPkg:** temporarily comment out unfinished method to fix build ([a7d675a](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/a7d675a785039d6c1f1e5a38b3493409523e7244))
* **logging:** make debug messages easier to read ([e7dd93c](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/e7dd93c278fe0327a9f243f723b43e61bedf7418))
* **package-lock:** update package lock ([7ad71d5](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/7ad71d5c133906ce9fd91c896e1533bdef1174c1))
* **recon:** npmCheck recieves restructured command options ([a970c33](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/a970c334a5c15a76f4c11e713c691bcc46c91a03))
* **tamper:** pass the full command object as a precedent ([71c0216](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/71c0216d849c311fff58a97c3981c306372f621b))
* **tamper:** update info messages ([f5c26dc](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/f5c26dc97c5d0d2f7327e22d42fbfb342c5b225d))
* **tamper:** use property names for options that aren't reserved words in strict mode (package) ([560e6da](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/560e6da129f4c161b37cf0a3c2444df16ee0fdc3))
* **validation:** validateOptions supports new command structure ([7655ac3](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/7655ac3fdae60f454b76291552992029431bfe0f))


### Features

* **switches:** update options to commands ([2b9e254](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/2b9e254bc09d06a75b7ef07d013ec966377e3d30))
* **tamper:** retrieve integrity hash and tarball url from npm view ([049c9b9](https://gitlab.com/gitlab-com/gl-security/security-operations/gl-redteam/bump-key/commit/049c9b976d957212556d0808630df7cb0293211c))
