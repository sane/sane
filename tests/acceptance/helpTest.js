/*eslint-env node, mocha, es6 */
'use strict';

var { assert }   = require('chai');
var version      = require('../../package.json').version;
var { execFile } = require('child-process-promise');
var sane         = require('../helpers/sane');

describe('Acceptance: sane help', function () {
  // beforeEach(function () {
  //   tmpdir = tmp.in(tmproot);
  //   process.chdir(tmpdir);
  // });

  // afterEach(function (done) {
  //   process.chdir(root);
  //   rimraf(tmproot, done);
  // });

  it('displays commands, it\'s aliases and the correct cli version', async function () {
    var output = await execFile(sane, ['help']);
    output = output.stdout;

    assert.include(output, 'new|n');
    assert.include(output, 'up|serve');
    assert.include(output, 'generate|g');
    assert.include(output, 'version: ' + version);
  });
});
