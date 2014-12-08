var {spawn} = require('child_process');
//with ES6 the same as: var spawn = require('child_process').spawn
var chalk = require('chalk');
// require('es6-shim');
var modelConversion = require('../tasks/modelConversion');

var supportedBlueprints = ['api', 'resource'];

module.exports = function generate(blueprint, name, attributes) {
  console.log(blueprint);
  console.log(name);
  console.log(attributes);
  if (supportedBlueprints.indexOf(blueprint) > -1) {
    if (name !== undefined) {
      var emberOptions = ['g', 'resource', name].concat(modelConversion.toEmber(attributes));
      var sailsOptions = ['generate', 'model', name].concat(modelConversion.toSails(attributes));

      var ember = spawn('ember', emberOptions, { cwd: 'client', stdio: 'inherit', env: process.env });
      var sails = spawn('sails', sailsOptions, { cwd: 'server', stdio: 'inherit', env: process.env });
      var sails = spawn('sails', ['generate', 'controller', name], { cwd: 'server', stdio: 'inherit', env: process.env });
    } else {
      console.log(chalk.yellow('A resource/api name is required, e.g. sane g resource user'));
    }
  } else {
    console.log(chalk.yellow('Bluepint ' + blueprint + ' is not supported'));
  }
}