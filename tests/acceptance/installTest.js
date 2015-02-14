// /*jshint quotmark: false*/

'use strict';

// var Promise          = require('../../lib/ext/promise');
// var assertFile       = require('../helpers/assert-file');
var assertFileEquals = require('../helpers/assertFileEquals');
// var conf             = require('../helpers/conf');
// var ember            = require('../helpers/ember');
var fs               = require('fs-extra');
// var outputFile       = Promise.denodeify(fs.outputFile);
var path             = require('path');
// var rimraf           = Promise.denodeify(require('rimraf'));
var root             = process.cwd();
var sane             = path.join(root, 'bin', 'sane');
var tmp              = require('tmp-sync');
var tmproot          = path.join(root, 'tmp');
var {execFile}       = require('child-process-promise');
// var EOL              = require('os').EOL;
// var BlueprintNpmTask = require('../helpers/disable-npm-on-blueprint');


describe('Acceptance: sane generate', function() {
  var tmpdir;

//   before(function() {
//     BlueprintNpmTask.disableNPM();
//     conf.setup();
//   });

//   after(function() {
//     BlueprintNpmTask.restoreNPM();
//     conf.restore();
//   });

  beforeEach(function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  afterEach(function() {
    process.chdir(root);
    fs.removeSync(tmproot);
  });

  function initApp() {
    return execFile(sane, [
      'new',
      '.',
      '--skip-npm',
      '--skip-bower',
      '--skip-analytics'
    ]);
  }

  async function generate(args) {
    var generateArgs = ['generate'].concat(args.split(' '));

    await initApp();

    return execFile(sane, generateArgs);
  }

  it('resource/api user', async function() {
    await generate('resource user');
    var expected = path.join(__dirname, '../fixtures/generate/ember/acceptance-test-empty-user-expected.js');

    assertFileEquals('client/app/models/user.js', expected);
  });

  it('resource/api user name:string age:number', async function() {
    await generate('resource user name:string age:number');
    var expected = path.join(__dirname, '../fixtures/generate/ember/acceptance-test-ember-user-expected.js');

    assertFileEquals('client/app/models/user.js', expected);
  });

});
