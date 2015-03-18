/*eslint no-process-exit:0*/
'use strict';

var glob  = require('glob');
var Mocha = require('mocha');
var chalk = require('chalk');


require('traceur').require.makeDefault(function (filename) {
// don't transpile our dependencies, just our app
//The first check is if you develop locally, the second for the globally installed moduel
  return (filename.indexOf('node_modules') === -1) ||
    (filename.indexOf('/node_modules/sane-cli/') > -1 && filename.indexOf('/node_modules/sane-cli/node_modules') === -1);
}, {asyncFunctions: true});

var mocha = new Mocha({
  // For some reason, tests take a long time on Windows (or at least AppVeyor)
  timeout: (process.platform === 'win32') ? 90000 : 18000,
  reporter: 'spec'
});

// Determine which tests to run based on argument passed to runner
var arg = process.argv[2];
if (!arg) {
  var root = 'tests/{unit,acceptance,lint}';
} else if (arg === 'lint') {
  var root = 'tests/lint';
} else {
  var root = 'tests/{unit,acceptance}';
}

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*Test.js');

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
