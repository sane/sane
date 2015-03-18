/*eslint-env node, mocha, es6 */
'use strict';

var lint = require('mocha-eslint');


var paths = [
  'bin/sane',
  'lib',
  'tests'
];
var options = {};
options.formatter = 'stylish';

lint(paths, options);
