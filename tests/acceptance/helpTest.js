'use strict';

var path       = require('path');
// var rimraf     = require('fs-extra').remove;
// var tmp        = require('tmp-sync');
var assert     = require('../helpers/assert');
var runCommand = require('../helpers/runCommand');
var version = require('../../package.json').version;

var root       = process.cwd();
// var tmproot    = path.join(root, 'tmp');
var sane      = path.join(root, 'bin', 'sane');
// var tmpdir;

describe('Acceptance: sane help', function() {
  // beforeEach(function() {
  //   tmpdir = tmp.in(tmproot);
  //   process.chdir(tmpdir);
  // });

  // afterEach(function(done) {
  //   process.chdir(root);
  //   rimraf(tmproot, done);
  // });

  it('displays commands, it\'s aliases and the correct cli version', function() {
    // this.timeout(10000);
    var output = '';

    return runCommand(sane, 'help', {
      onOutput: function(string) {
        output += string;
      }
    })
    .then(function() {
      assert.include(output, 'new|n');
      assert.include(output, 'up|serve');
      assert.include(output, 'generate|g');
      assert.include(output, 'version: ' + version);
    });
  });
});
