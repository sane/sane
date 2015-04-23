'use strict';

//with ES6 the same as: var spawn = require('child_process').spawn

var _require = require('child_process');

var spawn = _require.spawn;

var chalk = require('chalk');
var modelConversion = require('../tasks/modelConversion');
var trackCommand = require('../tasks/trackCommand');
var getAppNames = require('../tasks/getAppNames');
var ember = require('../helpers/ember');
var sails = require('../helpers/sails');
var Project = require('../tasks/Project');
var copyToProject = require('../tasks/copyToProject');
var getTemplates = require('../tasks/getTemplates');
var runMachine = require('../tasks/generate/runMachine');
var path = require('path');
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
module.exports = function generate(blueprint, name, attributes, options, leek) {
  var prepEmberOptions, emberOptions, sailsOptions, blueprintPath, templates;
  return regeneratorRuntime.async(function generate$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        name = name || '';
        attributes = attributes || '';
        options = options || {};
        context$1$0.next = 5;
        return Project.closest();

      case 5:
        project = context$1$0.sent;

        console.log('project is', project);
        addonBlueprints = project.getAddonBlueprints();

        if (typeof leek !== 'undefined') {
          trackCommand('generate ' + blueprint + ' ' + name + ' ' + attributes, {}, leek);
        }

        if (!(defaultBlueprints.indexOf(blueprint) > -1)) {
          context$1$0.next = 13;
          break;
        }

        if (name !== undefined) {
          prepEmberOptions = ['g', 'resource', name];

          if (options.pod) {
            prepEmberOptions.push('--pod');
          }

          emberOptions = prepEmberOptions.concat(modelConversion.toEmber(attributes));
          sailsOptions = ['generate', 'model', name].concat(modelConversion.toSails(attributes));

          spawn(ember, emberOptions, { cwd: clientName, stdio: 'inherit' });
          spawn(sails, sailsOptions, { cwd: serverName, stdio: 'inherit' });
          spawn(sails, ['generate', 'controller', name], { cwd: serverName, stdio: 'inherit' });
        } else {
          console.log(chalk.yellow('A resource/api name is required, e.g. sane g resource user'));
        }
        context$1$0.next = 42;
        break;

      case 13:
        if (!(addonBlueprints.indexOf(blueprint) > -1)) {
          context$1$0.next = 41;
          break;
        }

        blueprintPath = project.getBlueprintPath(blueprint);
        context$1$0.prev = 15;

        console.log('starting client machine');
        context$1$0.next = 19;
        return runMachine.client(blueprintPath, project.root, clientName, options);

      case 19:
        context$1$0.next = 25;
        break;

      case 21:
        context$1$0.prev = 21;
        context$1$0.t0 = context$1$0['catch'](15);

        console.log(chalk.red('The client-side generator failed, please report the error.'));
        throw context$1$0.t0;

      case 25:
        context$1$0.prev = 25;

        console.log('starting server machine');
        context$1$0.next = 29;
        return runMachine.server(blueprintPath, serverName, options);

      case 29:
        context$1$0.next = 35;
        break;

      case 31:
        context$1$0.prev = 31;
        context$1$0.t1 = context$1$0['catch'](25);

        console.log(chalk.red('The server-side generator failed, please report the error.'));
        throw context$1$0.t1;

      case 35:

        console.log('machines done, copy over templates');
        templates = getTemplates(path.join(blueprintPath, 'generate'));

        copyToProject(templates, project.root, options.force);

        console.log('all done!');
        context$1$0.next = 42;
        break;

      case 41:
        console.log(chalk.yellow('Blueprint ' + blueprint + ' is not supported'));

      case 42:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[15, 21], [25, 31]]);
};
//now copy over templates