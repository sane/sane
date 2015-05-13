'use strict';

var ember;
var path             = require('path');
var emberBin         = (process.platform === 'win32' ? 'ember.cmd' : 'ember');
var localEmber       = path.join(__dirname, '..', '..', 'node_modules', '.bin', emberBin);
var checkEnvironment = require('../tasks/checkEnvironment');
var which            = require('npm-which')(process.cwd());

if (!checkEnvironment.emberExists()) {
  ember = localEmber;
} else {
  ember = which.sync('ember');
}

module.exports = ember;
