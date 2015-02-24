'use strict';

//with ES6 the same as: var spawn = require('child_process').spawn
var { spawn } = require('child_process');
var chalk = require('chalk');
var modelConversion = require('../tasks/modelConversion');
var trackCommand = require('../tasks/trackCommand');
var getAppNames = require('../tasks/getAppNames');
var ember = require('../helpers/ember');
var sails = require('../helpers/sails');
var Project = require('../tasks/Project');
var copyToProject = require('../tasks/copyToProject');
var installNpmPackage = require('../tasks/installNpmPackage');
var path = require('path');

var serverName = getAppNames.server();
var clientName = getAppNames.client();
var project = Project.closest();
var defaultBlueprints = ['api', 'resource']
var addonBlueprints = project.getAddonBlueprints();

module.exports = function generate(blueprint, name, attributes, options, leek) {
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
  } else if(addonBlueprints.indexOf(blueprint) > -1) {
    var blueprintPath = project.getBlueprintPath(blueprint);

    var blueprint = require(blueprintPath);
    blueprint.client.exec({
      success: function(actions) {
        for (var emberAddon of actions.addEmberAddons) {
          // console.log(emberAddon);
          var addonSemVer = emberAddon.name + '@' + emberAddon.target
          var emberArgs = ['install:addon', addonSemVer]
          // console.log(emberArgs);
          spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(project.root, 'client') });
        }

      }
    });

    blueprint.server.exec({
      success: function(actions) {
        var serverPrefix = path.join(project.root, 'server');
        for (var npmPackage of actions.addNpmPackages) {
          var packageSemVer = npmPackage.name + '@' + npmPackage.target
          installNpmPackage([packageSemVer], { save: true, prefix: serverPrefix }).then(function(result){
            console.log(result + 'has been installed.');
          });
        }
      }
    });

    //now copy over templates
    var templates = getTemplates(path.join(blueprintPath, 'generate'));
    // console.log(templates);
    console.log('Copy over templates...');
    copyToProject(templates, project.root);
    console.log('Generator finished succesfully.');

  } else {
    console.log(chalk.yellow('Blueprint ' + blueprint + ' is not supported'));
  }
};
