# SANE Stack Changelog

### master
* [ENHANCEMENT] Made installation of Docker optional to get quick dev setup running.
* [FEATURE] Added basic `sane up` command. To start with docker add `--docker` flag
* [FEAURE] Added possibility to add a .sane-cli in your project root and/or home directory so you don't have to specifiy cli options such as --docker with each command

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
