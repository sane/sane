'use strict';

var execAbort = require('../execAbort');
var projectMeta = require('../projectMeta');
var fs = require('fs-extra');
var hbs = require('handlebars');
var path = require('path');
var templatesEndingWith = require('../tasks/templatesEndingWith');
var renameTemplate = require('../tasks/renameTemplate');
var PleasantProgress = require('pleasant-progress');
var chalk = require('chalk');

function normalizeOption(option) {
  if (option === 'mongodb') {
    return 'mongo';
  }
  if (option === 'postgresql') {
    return 'postgres';
  }
  return option;
}

function prepareTemplate(name, option) {
  var figDatabase = null;
  var figPort = 0;
  var figIsMysql = false;

  if (option !== 'disk'){
    figDatabase = option;
  }

  switch (option) {
    case 'mysql':
    figPort = 3306;
    figIsMysql = true;
    break;
    case 'postgres':
    figPort = 5432;
    break;
    case 'mongo':
    figPort = 27017;
    break;
  }
  var figVariables = { database: figDatabase, port: figPort, isMysql: figIsMysql};
  var template = fs.readFileSync(path.join(projectMeta.sanePath(), name), 'utf8');
  template = hbs.compile(template);
  return template(figVariables);
}

module.exports = function newProject(name, options) {
  options.database = normalizeOption(options.database);

  //Creates the new folder
  execAbort.sync('mkdir ' + name, 'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.');
  //change directories into projectRoot
  cd(name);

  //console.log('Setting up your Sails Container.');
  fs.writeFileSync(path.join('fig.yml'), prepareTemplate('fig.yml', options.database));
  execAbort.async('fig run server sails new .', 'Error: Creating a new sails project failed', 'Setting up Sails project and pulling latest Docker Containers')
  .then(function(){
    var progress = new PleasantProgress();
    progress.start(chalk.green('Installing Sails dependencies'));
    //console.log('Installing Sails dependencies...');
    execAbort.sync('fig run server npm i sails-generate-ember-blueprints --save');
    progress.step();
    execAbort.sync('fig run server npm i --save lodash');
    progress.step();
    execAbort.sync('fig run server npm i --save pluralize');
    progress.step();
    execAbort.sync('fig run server sails generate ember-blueprints');
    progress.step();

    //install the right database adapter
    if (options.database === 'postgres') {
      execAbort.sync('fig run server npm i --save sails-postgresql');
    } else if (options.database !== 'disk') {
      execAbort.sync('fig run server npm i --save sails-' + options.database);
    }
    progress.step();
    progress.stop();

    //Creating new ember project
    execAbort.async('ember new client', 'Error: Creating a new Ember Project failed', 'Creating Ember Project, installing bower and npm dependencies')
    .then(function(error, output){
      //copy over prepared files
      var templates = templatesEndingWith(projectMeta.sanePath(), '_models', options.database);
      for (var i = 0; i < templates.length; i++) {
        var templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
        var templateOutPath = renameTemplate(templates[i]);
        fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
      }
    });
  });
};