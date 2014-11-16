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
  var silent, progress, templates, i, templateInPath, templateOutPath;

  return regeneratorRuntime.async(function newProject$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      options.database = normalizeOption(options.database);
      silent = true;
      if (options.verbose) {
        silent = false;
      }

      //Creates the new folder
      execAbort.sync('mkdir ' + name,
        'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.',
        silent);
      //change directories into projectRoot
      cd(name);

      fs.writeFileSync(path.join('fig.yml'), prepareTemplate('fig.yml', options.database));

      context$1$0.next = 8;

      return execAbort.async('fig run server sails new .',
        silent,
        'Error: Creating a new sails project failed',
        'Setting up Sails project and downloading latest Docker Containers. Give it some time',
        'Sails container successfully created.');
    case 8:
      progress = new PleasantProgress();
      progress.start(chalk.green('Installing Sails dependencies'));

      context$1$0.next = 12;
      return execAbort.async('fig run server npm i sails-generate-ember-blueprints --save', silent);
    case 12:
      context$1$0.next = 14;
      return execAbort.async('fig run server npm i sails-generate-ember-blueprints --save', silent);
    case 14:
      context$1$0.next = 16;
      return execAbort.async('fig run server npm i sails-generate-ember-blueprints --save', silent);
    case 16:
      if (!(options.database === 'postgres')) {
        context$1$0.next = 21;
        break;
      }

      context$1$0.next = 19;
      return execAbort.async('fig run server npm i --save sails-postgresql', silent);
    case 19:
      context$1$0.next = 24;
      break;
    case 21:
      if (!(options.database !== 'disk')) {
        context$1$0.next = 24;
        break;
      }

      context$1$0.next = 24;
      return execAbort.async('fig run server npm i --save sails-' + options.database, silent);
    case 24:
      progress.stop();
      console.log(chalk.green('Sails dependencies successfully installed.'));
      context$1$0.next = 28;

      return execAbort.async('ember new client', silent, 'Error: Creating a new Ember Project failed',
        'Creating Ember Project, installing bower and npm dependencies',
        'Ember Project successfully created.');
    case 28:
      templates = templatesEndingWith(projectMeta.sanePath(), '_models', options.database);
      for (i = 0; i < templates.length; i++) {
        templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
        templateOutPath = renameTemplate(templates[i]);
        fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
      }
      console.log(chalk.green('SANE Project \'' + name + '\' successfully created.'));
    case 31:
    case "end":
      return context$1$0.stop();
    }
  }, null, this);
};