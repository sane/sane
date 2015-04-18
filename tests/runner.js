/*eslint no-process-exit:0*/
'use strict';

var glob  = require('glob');
var Mocha = require('mocha');
var chalk = require('chalk');

require('babel/register')({
  stage: 1,
  loose: true,
  ignore: false,
  only:/sane\/lib|sane\/tests/
});

var mocha = new Mocha({
  // For some reason, tests take a long time on Windows (or at least AppVeyor)
  timeout: (process.platform === 'win32') ? 90000 : 90000,
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

addFiles(mocha, '/**/InstallTest.js');
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
