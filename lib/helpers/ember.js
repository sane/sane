'use strict';

var which = require('npm-which')(process.cwd());

module.exports = which.sync('ember');