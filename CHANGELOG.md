# SANE Stack Changelog

### master

### 0.0.24
* [FEATURE] Added autoreload of sails server using [sails-hook-autoreload](https://github.com/sgress454/sails-hook-autoreload) hook
* [ENHANCEMENT] Added [sails-hook-dev](https://github.com/balderdashy/sails-hook-dev) and removed morgan request logging.
* [ENHANCEMENT] Bumped lodash to latest `3.x` version because of latest blueprints.
* [BUGFIX] Improved `sane new` command in certain edge cases
* [BUGFIX] Fixed a sails response bug that view is missing.
* [BUGFIX] Fixed errors in `sane new --skip-npm`.
* [BUGFIX] Fixed tests on Windows and AppVeyor.
* [BUGFIX] Full Windows support.
* [ENHANCEMENT] Changed to using `expect` instead of `assert` from chai module to match ember-cli [commit 2435679](https://github.com/ember-cli/ember-cli/commit/24356790ba1a6aead425c8bddfd96f6cb06ab1cb).

### 0.0.23
* [BUGFIX] Fixed ember-cli version check on `sane new`.

### 0.0.22
* [BUGFIX] Reverted a planned windows change which fixed `sane up` on Mac/Linus

### 0.0.21
* [BUGFIX] Fixed `cleanupSails()` procedure when creating a new project.
* [BUGFIX] Installing `sane-cli` now locally on new project creation.

### 0.0.20
* [BUGFIX] Forgot a change to `superspawn` to fix the windows issues.

### 0.0.19
* [BUGFIX] Changed to `superspawn` to fix issues on windows

### 0.0.18
* [FEATURE] Added support for local sane-cli (so you can have a fixed sane-cli per project)
* [ENHANCEMENT] Improved boot2docker running check
* [BUGFIX] explicit `sane up --docker=false` now working
* [ENHANCEMENT] No analytics for tests anymore by adding undocumented `--skip-analytics` flag
* [BUGFIX] Fixed installation for certain Unix platforms
* [BUGFIX] Fixed installation for Windows: Traceur was not loading modules properly.
* [BUGFIX] Fixed sails assets path for usage without grunt
* [ENHANCEMENT] Creating a new project now cleans up Sails to be API only (still including assets folder for easy deployment)

### 0.0.17
* [ENHANCEMENT] Update `leek` version which improves start-up time for commands that don't use tracking.
* [FEATURE] Added redis support.
* [FEATURE] Added `--skip-sails` and `--skip-ember flags to the `up` command, if you want to only start the backend or frontend server.

### 0.0.16

* [BUGFIX] Fixed bug with `sane new` not working without `--docker`
* [BUGFIX] Possibly fixing the EHOSTUNREACH issue.

### 0.0.15
* [BUGFIX] Fixed some bug with `sails-disk`
* [BUGFIX] Fixed a bug with `sane up`, using local install as well as recognizing a changed client folder
* [BUGFIX] Showing the right `sails version` when running `sane new` with docker

### 0.0.14
* [FEATURE] Added [https://github.com/expressjs/morgan](morgan) hook to sails app so each http request gets logged
* [FEATURE] Added `sane new --skip-npm --skip-bower` flags to skip npm and bower installation.
* [FEATURE] You can now rename your client/server folders, by renaming them and then adding the new name to your .sane-cli `apps`. See Docs for details
* [FEATURE] Added `--verbose` flag for `sane up`, which displays additional `boot2docker` output, only on windows & mac
* [BREAKING ENHANCEMENT] On windows and mac your sails-container-server gets automatically forwarded to localhost. Right now only supports the fixed 1337 porty. Removed the `--port-forward/-p` flag.
* [ENHANCEMENT] `pod` option is now supported in your `.sane-cli`
* [BUGFIX] Changed tracking code to an GA App
* [BREAKING BUGFIX] For consistency the short version of the `--docker` flag is now `-D` for all commands

### 0.0.13
* [ENHANCEMENT] Updated `fs-extra` to 0.13.0
* [ENHANCEMENT] Switched again to `traceur` so no compilation step is needed.
* [FEATURE] Added new feature behind `sane up -p` flag, to forward docker IP to localhost (using boot2docker).

### 0.0.12
* [BUGFIX] Fixed `sane generate resource` command.

### 0.0.11
* [BUGFIX] Fixed & improved database setup and config
* [ENHANCEMENT] Switched to [traceur](https://github.com/google/traceur-compiler) for easier development and fewer dependencies
* [ENHANCEMENT] Disabled grunt hook for sails per default which should reduce CPU usage
* [ENHANCEMENT] Added package.json to root folder, preparing for having a local sane-cli in the future
* [ENHANCEMENT] Added .editorconfig for better development consistency
* [FEATURE] Added `--live-reload` option to `sane up` to proxy through to `ember-cli`
* [ENHANCEMENT] Added anonymous google analytics tracking for sane-cli usage that can be disabled in the .sane-cli via the `disableAnalytics` option

### 0.0.10
* [BUGFIX] fixed missing comma in connections.js

### 0.0.9
* [ENHANCEMENT] Updated [es6-shim](https://github.com/paulmillr/es6-shim) to 0.21.0
* [BUGFIX] Fixed setup of blueprints for ember-data, as well as the right database adapter. Would recommend to setup the project new, or run the following commands in the `server` folder: `npm i sails-generate-ember-blueprints --save`, `npm i lodash --save`, `npm i pluralize --save`, `sails generate ember-blueprints` and depending on your database: `npm i --save sails-mongo`

### 0.0.8
* [ENHANCEMENT] Made installation of Docker optional to get quick dev setup running.
* [FEATURE] Added basic `sane up` command. To start with docker add `--docker` flag
* [FEAURE] Added possibility to add a .sane-cli in your project root and/or home directory so you don't have to specifiy cli options such as --docker with each command
* [FEAURE] Added `sane generate resource name attribue:type` command, to add models on the frontend as well as the backend
* [ENHANCEMENT] Now showing proper docker ip on `sane up --docker`
* [ENHANCEMENT] Now showing better log output when setting up new project.
* [BUGFIX] Does not create git repo within client folder anymore

### 0.0.6
* [ENHANCEMENT] Updated [commander.js](https://github.com/tj/commander.js) to 2.5.0
* [FEATURE] added `--verbose` flag to `sane new` command to display more output for debugging purposes
* [BUGFIX] Fixed an issue that the setup would never complete if no db (or disk) was given

### 0.0.5
* [ENHANCEMENT] Added pleasent-progress for better output of setup progress [#11](https://github.com/artificialio/sane/issues/11)

### 0.0.4

* [ENHANCEMENT] Changed to new, smaller and tagged docker container.
* [FEATURE] You can now specify latest or stable node versions in the fig.yml, as well as a fixed 0.10.32

### 0.0.3

* [FEATURE] added a basic CLI that can set up a Sails Container with Fig and a separate ember project, linking them together.
