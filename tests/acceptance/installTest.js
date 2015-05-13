'use strict';

var assertFile        = require('../helpers/assertFile');
var fs                = require('fs-extra');
var path              = require('path');
var tmp               = require('tmp-sync');
// var { execFile }      = require('child-process-promise');
var { spawn }      = require('child-process-promise');
var { initApp, sane, root, tmproot } = require('../helpers/acceptanceSetup');


describe('Acceptance: sane install', function () {
  var tmpdir;

  beforeEach(function () {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  afterEach(function () {
    process.chdir(root);
    fs.removeSync(tmproot);
  });

  async function install(args) {
    var installArgs = ['install'].concat(args.split(' '));

    await initApp();

    // to see output run spawn with { stdio: 'inherit' }
    return spawn(sane, installArgs, { stdio: 'inherit' });
    // return execFile(sane, installArgs);
  }

  // Note especially check the addToConfig functionality!
  it('sane-auth and runs generator', async function () {
    await install('sane-auth --verbose --force --skip-npm');
    // checks that addon has been installed
    assertFile(path.join('node_modules', 'sane-auth', 'package.json'));
    // check that it also got save-deved
    assertFile('package.json', {
      contains: [
        'devDependencies',
        '"sane-auth": '
      ]
    });

    // checks that templates have been copied over properly from the generator
    assertFile(path.join('server', 'api', 'policies', 'hasToken.js'));

    assertFile(path.join('server', 'package.json'), {
      contains: [
        'dependencies',
        'jsonwebtoken'
      ]
    });

    assertFile(path.join('client', 'app', 'models', 'user.js'));
  });

});
