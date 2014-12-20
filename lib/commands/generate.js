'use strict';

//with ES6 the same as: var spawn = require('child_process').spawn
var {spawn} = require('child_process');
var chalk = require('chalk');
var modelConversion = require('../tasks/modelConversion');
var trackCommand = require('../tasks/trackCommand');

var supportedBlueprints = ['api', 'resource'];

module.exports = function generate(blueprint, name, attributes, options, leek) {
  trackCommand(`generate ${blueprint} ${name} ${attributes}`, {}, leek);
  if (supportedBlueprints.indexOf(blueprint) > -1) {
    if (name !== undefined) {

      var prepEmberOptions = ['g', 'resource', name];

      if (options.pod) {
        prepEmberOptions.push('--pod');
      }

      var emberOptions = prepEmberOptions.concat(modelConversion.toEmber(attributes));
      var sailsOptions = ['generate', 'model', name].concat(modelConversion.toSails(attributes));

      spawn('ember', emberOptions, { cwd: 'client', stdio: 'inherit', env: process.env });
      spawn('sails', sailsOptions, { cwd: 'server', stdio: 'inherit', env: process.env });
      spawn('sails', ['generate', 'controller', name], { cwd: 'server', stdio: 'inherit', env: process.env });
    } else {
      console.log(chalk.yellow('A resource/api name is required, e.g. sane g resource user'));
    }
  } else {
    console.log(chalk.yellow('Bluepint ' + blueprint + ' is not supported'));
  }
};