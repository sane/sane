'use strict';

var path = require('path');


var root      = process.cwd();
var saneExec  = (process.platform === 'win32' ? 'sane.cmd' : 'sane');
var sane      = path.join(root, 'bin', saneExec);

module.exports = sane;
