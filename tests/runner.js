'use strict';

var glob = require('glob');
var Mocha = require('mocha');

require('babel/register')({
  experimental: true,
  loose: true
});

var mocha = new Mocha({
  // For some reason, tests take a long time on Windows (or at least AppVeyor)
  timeout: (process.platform === 'win32') ? 90000 : 90000,
  reporter: 'spec'
});

// var arg = process.argv[2];
var root = 'tests/{unit,acceptance}';

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*Test.js');
// addFiles(mocha, '/**/getAddonTest.js');

// if (arg === 'all') {
//   addFiles(mocha, '/**/*-slow.js');
// }

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
