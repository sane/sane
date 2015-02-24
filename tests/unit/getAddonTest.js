'use strict';

var { expect } = require('chai');
var Project = require('../../lib/tasks/Project');
var pluck = require('lodash/collection/pluck');
var path = require('path');


describe('getAddon tests', async function() {

  it('find closest project', async function() {
    var project = await Project.closest('/Users/markus/Projects/Artificial/moneyflow');
    console.log(project);
    var addons = project.discoverAddons();
    console.log(addons);
    var supportedBlueprints = pluck(addons, 'name');
    console.log(project.getBlueprintPath(supportedBlueprints[0]));
    var blueprintPath = project.getBlueprintPath(supportedBlueprints[0]);
    console.log(blueprintPath);
    // var generatePath = path.join(blueprintPath, 'generate');
    // var client = require(path.join(generatePath, 'client'));
    // var server = require(path.join(generatePath, 'client'));
    // console.log(client.fn());
    var { client } = require(blueprintPath);
    client.exec({
      success: function(actions){
        console.log(actions);
      }
    });
    // console.log();
    // console.log(addons.pkg);
    expect('1').to.equal('1');
  });
});
