'use strict';

// var commandOptions = require('../../factories/command-options');
var { expect } = require('chai');

var newCommand     = require('../../../lib/commands/new');

describe('new command', function() {
  var options; //, command

  beforeEach(function() {
    options = {
      database: 'disk'
    };

    // command = new NewCommand(name, options);
  });

  // it('doesn\'t allow to create an application named `test`', function() {
  //   return command.validateAndRun(['test']).then(function() {
  //     assert.ok(false, 'should have rejected with an application name of test');
  //   })
  //   .catch(function(error) {
  //     assert.equal(error.message, 'We currently do not support a name of `test`.');
  //   });
  // });

  // it('doesn\'t allow to create an application named `ember`', function() {
  //   return command.validateAndRun(['ember']).then(function() {
  //     assert.ok(false, 'should have rejected with an application name of test');
  //   })
  //   .catch(function(error) {
  //     assert.equal(error.message, 'We currently do not support a name of `ember`.');
  //   });
  // });

  // it('doesn\'t allow to create an application named `vendor`', function() {
  //   return command.validateAndRun(['vendor']).then(function() {
  //     assert.ok(false, 'should have rejected with an application name of `vendor`');
  //   })
  //   .catch(function(error) {
  //     assert.equal(error.message, 'We currently do not support a name of `vendor`.');
  //   });
  // });

  it('doesn\'t allow to create an application with a period in the name', async function() {
    try {
      await newCommand('i.love.dots', options);
      expect(false, 'should have rejected with period in the application name');
    } catch (error) {
      expect(error.message).to.equal(`Sane currently does not support a projectname of 'i.love.dots'.`);
    }
  });

  // it('doesn\'t allow to create an application with a name beginning with a number', function() {
  //   return command.validateAndRun(['123-my-bagel']).then(function() {
  //     assert.ok(false, 'should have rejected with a name beginning with a number');
  //   })
  //   .catch(function(error) {
  //     assert.equal(error.message, 'We currently do not support a name of `123-my-bagel`.');
  //   });
  // });

  // it('shows a suggestion messages when the application name is a period', function() {
  //   return command.validateAndRun(['.']).then(function() {
  //     assert.ok(false, 'should have rejected with a name `.`');
  //   })
  //   .catch(function(error) {
  //     assert.equal(error.message, 'Trying to generate an application structure on this folder? Use `ember init` instead.');
  //   });
  // });

});
