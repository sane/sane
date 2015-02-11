'use strict';

var glob = require('glob');
var Mocha = require('mocha');

require("6to5/register")({
  experimental: true
});


var mocha = new Mocha({
  timeout: 18000,
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
