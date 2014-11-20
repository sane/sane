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
// var spawn = require('child_process').spawn;
require('shelljs/global');
require('es6-shim');


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

module.exports = async function newProject(name, options) {
  options.database = normalizeOption(options.database);
  var silent = true;
  if (options.verbose) {
    silent = false;
  }

  var figRun = '';
  var installMsg = 'Setting up Sails project locally.';
  var successMsg = 'project';

  //--docker is set
  if (options.docker) {
    figRun = 'fig run server ';
    installMsg = 'Setting up Sails project and downloading latest Docker Containers. Give it some time';
    successMsg = 'container';
  }

  //Creates the new folder
  execAbort.sync('mkdir ' + name,
    'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.',
    silent);
  //change directories into projectRoot
  cd(name);

  fs.writeFileSync(path.join('fig.yml'), prepareTemplate('fig.yml', options.database));

  var cliConfig = {};
  for (var opt in options) {
    //exclude properties that are not cli options
    if (options.hasOwnProperty(opt)
      && !opt.startsWith('_')
      && ['commands', 'options', 'parent'].indexOf(opt) === -1) {
      cliConfig[opt] = options[opt];
  }
}

  //creating a default .sane-cli based on the parameters used in the new command
  fs.writeFileSync(path.join('.sane-cli'), JSON.stringify(cliConfig, null, 2));

  //if docker is not set manually create the server folder and cd in
  if (!options.docker) {
    mkdir('server');
    cd('server');
  }

  //TODO(markus): If we use spawn with stdio inherit we can print the proper output for fog
  //should also fix the ember-cli output
  //var fig = spawn('fig', ['run', 'server', 'sails', 'new', '.'], { stdio: 'inherit', env: process.env });

  // fig.on('exit', function (code) {
  //   console.log('Fig process exited with code ' + code);
  // });

  await execAbort.async(figRun + 'sails new .',
    silent,
    'Error: Creating a new sails project failed',
    installMsg,
    'Sails ' + successMsg + ' successfully created.');

  var progress = new PleasantProgress();
  progress.start(chalk.green('Installing Sails dependencies'));

  await execAbort.async(figRun + 'npm i sails-generate-ember-blueprints --save', silent);
  await execAbort.async(figRun + 'npm i lodash --save', silent);
  await execAbort.async(figRun + 'npm i pluralize --save', silent);
  await execAbort.async(figRun + 'sails generate ember-blueprints', silent);

  if (options.database === 'postgres') {
    await execAbort.async(figRun + 'npm i --save sails-postgresql', silent);
  } else if (options.database !== 'disk') {
    await execAbort.async(figRun + 'npm i --save sails-' + options.database, silent);
  }

  //cd back out again
  if (!options.docker) {
    cd('..');
  }

  progress.stop();
  console.log(chalk.green('Sails dependencies successfully installed.'));
  //Creating new ember project
  await execAbort.async('ember new client', silent, 'Error: Creating a new Ember Project failed',
    'Creating Ember Project, installing bower and npm dependencies',
    'Ember Project successfully created.');

  //TODO(markus): Tis fixes any output issues ember-cli is having
  // var ember = spawn('ember', ['new', 'client'], { stdio: 'inherit', env: process.env });

  // ember.on('exit', function (code) {
  //   process.exit(1);
  // });


  //copy over prepared files
  var templates = templatesEndingWith(projectMeta.sanePath(), '_models', options.database);
  for (var i = 0; i < templates.length; i++) {
    var templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
    var templateOutPath = renameTemplate(templates[i]);
    fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
  }
  console.log(chalk.green('SANE Project \'' + name + '\' successfully created.'));
};