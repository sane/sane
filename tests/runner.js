/*eslint no-process-exit:0*/
'use strict';

var glob  = require('glob');
var Mocha = require('mocha');
var chalk = require('chalk');

//transforms all following require's to parse ES6/7 code
require('traceur').require.makeDefault(function (filename) {
  // don't transpile our dependencies, just our app
  //The first check is if you develop locally, the second for the globally installed module
  if (filename.indexOf('bin/sane') > -1) {
    return false;
  }
  //The first check is if you develop locally, the second for the globally installed moduel
  return (filename.indexOf('node_modules') === -1) ||
    (filename.indexOf(path.join('node_modules', 'sane-cli')) > -1 &&
      filename.indexOf(path.join('node_modules', 'sane-cli', 'node_modules')) === -1);
}, {asyncFunctions: true});

var mocha = new Mocha({
  // For some reason, tests take a long time on Windows (or at least AppVeyor)
  timeout: (process.platform === 'win32') ? 150000 : 40000,
  reporter: 'spec'
});

// Determine which tests to run based on argument passed to runner
var arg = process.argv[2];
var root;
if (!arg) {
  root = 'tests/{unit,acceptance}';
} else if (arg === 'unit') {
  root = 'tests/unit';
} else {
  root = 'tests/{unit,acceptance}';
}

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*Test.js');
// addFiles(mocha, '/**/getAddonTest.js');

mocha.run(function (failures) {
  process.on('exit', function () {
    if (failures === 1) {
      console.log(chalk.red('1 Failing Test'));
    } else if (failures > 1) {
      console.log(chalk.red(failures, 'Failing Tests'));
    } else if (failures === 0) {
      console.log(chalk.green('All Tests Passed!'));
    }
    process.exit(failures);
  });
});
