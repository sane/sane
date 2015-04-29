'use strict';

//with ES6 the same as: var spawn = require('child_process').spawn
var { spawn }         = require('child_process');
var chalk             = require('chalk');
var modelConversion   = require('../tasks/modelConversion');
var trackCommand      = require('../tasks/trackCommand');
var getAppNames       = require('../tasks/getAppNames');
var ember             = require('../helpers/ember');
var sails             = require('../helpers/sails');
var Project           = require('../tasks/Project');
var copyToProject     = require('../tasks/copyToProject');
var getTemplates      = require('../tasks/getTemplates');
var runMachine        = require('../tasks/generate/runMachine');
var path              = require('path');
var log               = require('captains-log')();
var serverName = getAppNames.server();
var clientName = getAppNames.client();
var defaultBlueprints = ['api', 'resource'];
var project;
var addonBlueprints;

/**
 * @overview A generator is a one-time task that is being executed by sane.
 * These tasks usually are usually related to generating code, copying over files,
 * installing modules/addons or running sails and ember commands.
 * This function loads and runs all the existing generators in your project.
 * @param {String} blueprint - The name of the blueprint itself (e.g. resource)
 * @param {String} [name] - An extra, simple string parameter usually used for dynamic naming
 * @param {String} [attributes] - An extra list of parameters used by the generator, such as model attributes
 * @param {Object} [options] - Options passed over by commander including all set flags such --verbose
 * @param {Object} [leek] - If set this command is tracked to understand cli usage better
*/
module.exports = async function generate(blueprint, name, attributes, options, leek) {
  name = name || '';
  attributes = attributes || '';
  options = options || {};
  project = await Project.closest();
  log.verbose('Your project details: ', project);
  addonBlueprints = project.getAddonBlueprints();

  if (typeof leek !== 'undefined') {
    trackCommand(`generate ${blueprint} ${name} ${attributes}`, {}, leek);
  }

  if (defaultBlueprints.indexOf(blueprint) > -1) {
    if (name !== undefined) {

      var prepEmberOptions = ['g', 'resource', name];

      if (options.pod) {
        prepEmberOptions.push('--pod');
      }

      var emberOptions = prepEmberOptions.concat(modelConversion.toEmber(attributes));
      var sailsOptions = ['generate', 'model', name].concat(modelConversion.toSails(attributes));

      spawn(ember, emberOptions, { cwd: clientName, stdio: 'inherit' });
      spawn(sails, sailsOptions, { cwd: serverName, stdio: 'inherit' });
      spawn(sails, ['generate', 'controller', name], { cwd: serverName, stdio: 'inherit' });

    } else {
      console.log(chalk.yellow('A resource/api name is required, e.g. sane g resource user'));
    }
  } else if (addonBlueprints.indexOf(blueprint) > -1) {
    var blueprintPath = project.getBlueprintPath(blueprint);

    try {
      log.verbose('Starting client machine...');
      await runMachine.client(blueprintPath, project.root, clientName, options);
    } catch (error) {
      console.log(chalk.red('The client-side generator errored, please report that.')
        + chalk.yellow(' Finishing up your installation though.'));
    }

    try {
      log.verbose('Starting server machine...');
      await runMachine.server(blueprintPath, serverName, options);
    } catch (error) {
      console.log(chalk.red('The server-side generator errored, please report that.')
        + chalk.yellow(' Finishing up your installation though.'));
    }

    log.verbose('Machines done, copy over templates now...');
    //now copy over templates
    var templates = getTemplates(path.join(blueprintPath, 'generate'));
    copyToProject(templates, project.root, options.force);

  } else {
    console.log(chalk.yellow('Blueprint ' + blueprint + ' is not supported'));
  }
};
