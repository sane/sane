'use strict';

var assertFile = require('../helpers/assertFile');
var fs         = require('fs-extra');
var tmp        = require('tmp-sync');
var { spawn }  = require('child-process-promise');
var { initApp, sane, root, tmproot } = require('../helpers/acceptanceSetup');


describe('Acceptance: sane generate', function () {
  var tmpdir;

  beforeEach(function () {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  afterEach(function () {
    process.chdir(root);
    fs.removeSync(tmproot);
  });

  async function generate(args) {
    await initApp();

    var generateArgs = ['generate'].concat(args.split(' '));
    var generateOpts = {
      stdio: 'ignore'
    };
    return spawn(sane, generateArgs, generateOpts);
  }

  it('resource/api user', async function () {
    await generate('resource user');

    assertFile('client/app/models/user.js', {
      contains: [
        'import DS from \'ember-data\';',
        'export default DS.Model.extend'
      ]
    });
  });

  it('resource/api user name-string age-number', async function () {
    await generate('resource user name:string age:number');

    assertFile('client/app/models/user.js', {
      contains: [
        'import DS from \'ember-data\';',
        'name: DS.attr(\'string\'),',
        'age: DS.attr(\'number\')'
      ]
    });

  });


  /*
   we expect that all:
     server models will be singular
     server controllers will be singular
     ember models will be singular
     ember routes will be whatever was passed in


  */
  // Assert that the proper filenames are generated in
  //     client when singular format is used
  //        (e.g. sane generate resource user)
  //        ()
  //     server when singular format is used (e.g. sane generate resource user)
  //     client when plural format is used (e.g. sane generate resource users)
  //     server when plural format is used (e.g. sane generate resource users)

  // test model resource creation
  it('should generate a singular sails model  when passed a singular value', async function () {
    await generate('resource foo');

    assertFile('server/api/models/Foo.js');
  });

  it('should generate a singular sails model when passed a plural value', async function () {
    await generate('resource bars');

    assertFile('server/api/models/Bar.js');
  });
  it('should generate a singular ember model when passed a singular value', async function () {
    await generate('resource foo');

    assertFile('client/app/models/foo.js');
  });

  it('should generate a singular ember model when passed a plural value', async function () {
    await generate('resource bars');

    assertFile('client/app/models/bar.js');
  });

  // test controller creation
  it('should generate a singular sails controller when passed a singular value', async function () {
    await generate('resource foo');
    assertFile('server/api/controllers/FooController.js');
  });

  it('should generate a singular sails controller when passed a plural value', async function () {
    await generate('resource bars');
    assertFile('server/api/controllers/BarController.js');
  });
  // test ember route createion
  it('should generate a singular ember route when passed a singular value', async function () {
    await generate('resource foo');
    assertFile('client/app/routes/foo.js');
  });

  it('should generate a plural ember route when passed a plural value', async function () {
    await generate('resource bars');
    assertFile('client/app/routes/bars.js');
  });
  // test ember template creation
  it('should generate a singular ember template when passed a singular value', async function () {
    await generate('resource foo');
    assertFile('client/app/templates/foo.hbs');
  });

  it('should generate a plural ember template when passed a plural value', async function () {
    await generate('resource bars');
    assertFile('client/app/templates/bars.hbs');
  });
    // start of test to validate the sails models and controllers are created as expected.
    //
    // it('resource/api person name:string age:number (server)', async function () {
    //     await generate('resource person name:string age:number');
    //
    //     assertFile('server/api/models/Users.js', {
    //       contains: [
    //         'module.exports = {',
    //         'name : { type: \'string\' },',
    //         'age : { type: \'float\' },'
    //       ]
    //     });
    //   });
});
