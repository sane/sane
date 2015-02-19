'use strict';

// var ember     = require('../helpers/ember');
// var assert    = require('assert');
// var forEach   = require('lodash-node/compat/collections/forEach');
// var walkSync  = require('walk-sync');
// var Blueprint = require('../../lib/models/blueprint');
// var util      = require('util');
// var conf      = require('../helpers/conf');
// var EOL       = require('os').EOL;
var fs           = require('fs-extra');
var path         = require('path');
var tmp          = require('tmp-sync');
// var {execFile}   = require('child-process-promise');
var spawnPromise = require('superspawn').spawn;
var sane         = require('../helpers/sane');

// var mock         = require('mock-fs');
require('shelljs/global');

var assertFile   = require('../helpers/assertFile');
var assertFileEquals = require('../helpers/assertFileEquals');

var root         = process.cwd();
var tmproot      = path.join(root, 'tmp');

describe('Acceptance: sane new', function() {
  this.timeout(30000);
  var tmpdir;
//   before(conf.setup);

//   after(conf.restore);

//   beforeEach(function() {
//     return tmp.setup('./tmp')
//       .then(function() {
//         process.chdir('./tmp');
//       });
//   });
  beforeEach(function() {
    // mock();
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  afterEach(function() {
    process.chdir(root);
    // mock.restore;
    fs.removeSync(tmproot);
  });

  function initApp(args) {
    var args = args || ['new', '.', '--skip-npm', '--skip-bower', '--skip-analytics'];
	var opts = { stdio: 'ignore', env: process.env };
    return spawnPromise(sane, args, opts);
  }

//   function confirmBlueprintedForDir(dir) {
//     return function() {
//       var blueprintPath = path.join(root, dir, 'files');
//       var expected      = walkSync(blueprintPath);
//       var actual        = walkSync('.').sort();
//       var folder        = path.basename(process.cwd());

//       forEach(Blueprint.renamedFiles, function(destFile, srcFile) {
//         expected[expected.indexOf(srcFile)] = destFile;
//       });

//       expected.sort();

//       assert.equal(folder, 'foo');
//       assert.deepEqual(expected, actual, EOL + ' expected: ' +  util.inspect(expected) +
//                        EOL + ' but got: ' +  util.inspect(actual));

//     };
//   }

//   function confirmBlueprinted() {
//     return confirmBlueprintedForDir('blueprints/app');
//   }

  it('sane new . in empty folder works and adds specified dependencies to server package.json', async function() {
    await initApp();

    //taken from lib/commands/new.js
    var sailsPackages = ['sails-generate-ember-blueprints', 'lodash',
      'morgan', 'pluralize', 'sails-disk'];

    assertFile('server/package.json', {
        contains: sailsPackages
      });
  });

  it('sane new facebook -d postgres, where facebook does not yet exist, works and adds settings to fig.yml', async function() {
    await initApp([
      'new',
      'facebook',
      '--skip-npm',
      '--skip-bower',
      '-d',
      'postgres'
    ]);

    process.chdir('facebook');

    var expectedFig = path.join(__dirname, '../fixtures/new/acceptance-test-fig-expected.yml');
    var expectedConfig = path.join(__dirname, '../fixtures/new/acceptance-test-sane-cli-expected.js');

    assertFileEquals('fig.yml', expectedFig);
    assertFileEquals('.sane-cli', expectedConfig);
  });

  it('sane new myspace -d redis, where myspace does not exist, works and creates myspace with redis', async function() {
    await initApp([
      'new',
      'myspace',
      '--skip-npm',
      '--skip-bower',
      '-d',
      'redis'
    ]);

    process.chdir('myspace');

    assertFile('.sane-cli');
  });

//   it('ember new foo, where foo does not yet exist, works', function() {
//     return ember([
//       'new',
//       'foo',
//       '--skip-npm',
//       '--skip-bower'
//     ]).then(confirmBlueprinted);
//   });

//   it('ember new with empty app name doesnt throw exception', function() {
//     return ember([
//       'new',
//       ''
//     ]);
//   });

//   it('ember new without app name doesnt throw exception', function() {
//     return ember([
//       'new'
//     ]);
//   });

//   it('ember new with app name creates new directory and has a dasherized package name', function() {
//     return ember([
//       'new',
//       'FooApp',
//       '--skip-npm',
//       '--skip-bower',
//       '--skip-git'
//     ]).then(function() {
//       assert(!fs.existsSync('FooApp'));

//       var pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
//       assert.equal(pkgJson.name, 'foo-app');
//     });
//   });

//   it('Cannot run ember new, inside of ember-cli project', function() {
//     return ember([
//       'new',
//       'foo',
//       '--skip-npm',
//       '--skip-bower',
//       '--skip-git'
//     ]).then(function() {
//       return ember([
//         'new',
//         'foo',
//         '--skip-npm',
//         '--skip-bower',
//         '--skip-git'
//       ]).then(function() {
//         assert(!fs.existsSync('foo'));
//       });
//     }).then(confirmBlueprinted);
//   });

//   it('ember new with blueprint uses the specified blueprint directory', function() {
//     return tmp.setup('./tmp/my_blueprint')
//       .then(function() {
//         return tmp.setup('./tmp/my_blueprint/files');
//       })
//       .then(function() {
//         fs.writeFileSync('./tmp/my_blueprint/files/gitignore');
//         process.chdir('./tmp');

//         return ember([
//           'new',
//           'foo',
//           '--skip-npm',
//           '--skip-bower',
//           '--skip-git',
//           '--blueprint=my_blueprint'
//         ]);
//       })
//       .then(confirmBlueprintedForDir('tmp/my_blueprint'));
//   });


//   it('ember new with git blueprint uses checks out the blueprint and uses it', function(){
//     this.timeout(10000);

//     return ember([
//       'new',
//       'foo',
//       '--skip-npm',
//       '--skip-bower',
//       '--skip-git',
//       '--blueprint=https://github.com/trek/app-blueprint-test.git'
//     ]).then(function() {
//       assert(fs.existsSync('.ember-cli'));
//     });
//   });

//   it('ember new without skip-git flag creates .git dir', function(){
//     return ember([
//       'new',
//       'foo',
//       '--skip-npm',
//       '--skip-bower'
//     ]).then(function() {
//       assert(fs.existsSync('.git'));
//     });
//   });

//   it('ember new with --dry-run does not create new directory', function(){
//     return ember([
//       'new',
//       'foo',
//       '--dry-run'
//     ]).then(function(){
//       var cwd = process.cwd();
//       assert(!cwd.match('foo'), 'does not change cwd to foo in a dry run');
//       assert(!fs.existsSync(path.join(cwd, 'foo')), 'does not create new directory');
//       assert(!fs.existsSync(path.join(cwd, '.git')), 'does not create git in current directory');
//     });
//   });
});
