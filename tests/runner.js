'use strict';

var glob = require('glob');
var Mocha = require('mocha');

require("babel/register")({
  experimental: true
});

var timeout = 18000;

if (process.platform === 'win32') {
  //apparently windows is taking its time...
  //Well yeah look into performance improvements.
  timeout = 90000;
}

var mocha = new Mocha({
  timeout: timeout,
  reporter: 'spec'
});

// var arg = process.argv[2];
var root = 'tests/{unit,acceptance}';

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*Test.js');

// if (arg === 'all') {
//   addFiles(mocha, '/**/*-slow.js');
// }

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
