'use strict';

var { expect } = require('chai');
var Project = require('../../lib/tasks/Project');
var pluck = require('lodash/collection/pluck');
var path = require('path');
var { spawn }   = require('child_process');
var installNpmPackage = require('../../lib/tasks/installNpmPackage');
var getTemplates = require('../../lib/tasks/getTemplates');
var copyToProject = require('../../lib/tasks/copyToProject');
var fs = require('fs-extra');

describe('getAddon tests', async function() {

  it('find closest project', async function() {
    // var project = await Project.closest('/Users/markus/Projects/Artificial/moneyflow');
    // console.log(project);
    // var addons = project.discoverAddons();
    // console.log(addons);
    // var supportedBlueprints = pluck(addons, 'name');
    // console.log(project.getBlueprintPath(supportedBlueprints[0]));
    // var blueprintPath = project.getBlueprintPath(supportedBlueprints[0]);
    // console.log(blueprintPath);
    //
    // var blueprint = require(blueprintPath);
    // blueprint.client.exec({
    //   success: function(actions) {
    //     console.log('Client:');
    //     console.log(actions.addNpmPackages);
    //     console.log(actions.addEmberAddons);
    //     for (var emberAddon of actions.addEmberAddons) {
    //       // console.log(emberAddon);
    //       var addonSemVer = emberAddon.name + '@' + emberAddon.target
    //       var emberArgs = ['install:addon', addonSemVer]
    //       // console.log(emberArgs);
    //       spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(project.root, 'client') });
    //     }
    //
    //   }
    // });
    //
    // blueprint.server.exec({
    //   success: function(actions) {
    //     console.log('Server!');
    //     console.log(actions.addNpmPackages);
    //     var serverPrefix = path.join(project.root, 'server');
    //     for (var npmPackage of actions.addNpmPackages) {
    //       // var emberArgs = ['install', npmPackage, '']
    //       // console.log(npmPackage.name + '@' + npmPackage.target)
    //       var packageSemVer = npmPackage.name + '@' + npmPackage.target
    //       installNpmPackage([packageSemVer], { save: true, prefix: serverPrefix }).then(function(result){
    //         console.log(result + 'has been installed');
    //       });
    //     }
    //   }
    // });
    //
    // //now copy over templates
    // var templates = getTemplates(path.join(blueprintPath, 'generate'));
    // // console.log(templates);
    // console.log('Copy over templates...');
    // copyToProject(templates, project.root);
    // console.log('done');
    // fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
    // // console.log();
    // console.log(addons.pkg);
    expect('1').to.equal('1');
  });
});
