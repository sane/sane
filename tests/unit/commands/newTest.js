/*eslint-env node, mocha, es6 */
'use strict';

var { expect } = require('chai');
var newCommand = require('../../../lib/commands/new');


describe('new command', function () {
  var options; // , command

  beforeEach(function () {
    options = {
      database: 'disk'
    };
  });

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
