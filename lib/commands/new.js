'use strict';

var execAbort = require('../execAbort');
var projectMeta = require('../projectMeta');
var fs = require('fs-extra');
var hbs = require('handlebars');
var path = require('path');
var getTemplates = require('../tasks/getTemplates');
var renameTemplate = require('../tasks/renameTemplate');
var PleasantProgress = require('pleasant-progress');
var chalk = require('chalk');
var checkEnvironment = require('../tasks/checkEnvironment');
var spawnPromise = require('child-process-promise').spawn;
var execPromise = require('child-process-promise').exec;
var projectMeta = require('../projectMeta');
require('shelljs/global');
// require('es6-shim');


function normalizeOption(option) {
  if (option === 'mongodb') {
    return 'mongo';
  }
  if (option === 'postgresql') {
    return 'postgres';
  }
  return option;
}

function prepareFigTemplate(name, option) {
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
  return prepareTemplate(name, figVariables);
}

function prepareTemplate(name, variables) {
  var template = fs.readFileSync(path.join(projectMeta.sanePath(), 'templates', name), 'utf8');
  template = hbs.compile(template);
  return template(variables);
}

/*
 * Make sure the executed commands work with docker enabled/disabled
 */
function dockerExec(cmd, runsWithDocker, silent) {
  if (silent === undefined) {
    silent = false;
  }
  var options = { stdio: 'inherit', env: process.env };
  if (silent) {
    options = { env: process.env };
  }
  if (runsWithDocker) {
    var cmdMain = 'fig';
    var cmdArgs = ['run', 'server'].concat(cmd.split(' '));
  } else {
    var cmdMain = cmd.split(' ')[0];
    var cmdArgs = cmd.split(' ').slice(1);
  }

  return spawnPromise(cmdMain, cmdArgs, options);
}

module.exports = async function newProject(name, options) {
  options.database = normalizeOption(options.database);
  var silent = true;
  if (options.verbose) {
    silent = false;
  }

  var figRun = '';
  var figCmd = false;
  var installMsg = 'Setting up Sails project locally.';
  // var successMsg = 'project';

  if (!checkEnvironment.emberExists()) {
    console.log('sane requires the latest ember-cli to be installed. Run npm install -g ember-cli.');
    console.log('Exitting now.');
    process.exit(1);
  }

  //--docker is set
  if (options.docker) {
    installMsg = 'Setting up Sails project and downloading latest Docker Containers.';
    if (!checkEnvironment.dockerExists()) {
      console.log('sane requires the latest docker/boot2docker/fig to be installed. Check https://github.com/artificialio/sane/blob/master/README.md for more details.');
      console.log('Exitting now.');
      process.exit(1);
    }
  } else {
    if (!checkEnvironment.sailsExists()) {
      console.log('sane requires the latest sails to be installed. Run npm install -g ember-cli.');
      console.log('Exitting now.');
      process.exit(1);
    }
  }

  console.log(`Sane version: ${projectMeta.version()}\n`);

  //Creates the new folder
  execAbort.sync('mkdir ' + name,
    'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.',
    silent);
  //change directories into projectRoot
  cd(name);

  fs.writeFileSync(path.join('fig.yml'), prepareFigTemplate('fig.yml', options.database));
  fs.writeFileSync(path.join('package.json'), prepareTemplate('package.json', { name: name }));

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
  console.log(chalk.green(installMsg));

  process.stdout.write(`sails version: ${exec('sails version', { silent: true }).output}`);

  await dockerExec('sails new .', options.docker);

  // await execAbort.async(figRun + 'sails new .',
  //   silent,
  //   'Error: Creating a new sails project failed',
  //   installMsg,
  //   'Sails ' + successMsg + ' successfully created.');

  var progress = new PleasantProgress();
  progress.start(chalk.green('Istalling Sails packages for tooling via npm.'));
  // console.log(chalk.green('Installing Sails dependencies.'));

  //TODO(markus): Think about using spawn with stdio: inherit
  // await execAbort.async(figRun + 'npm i sails-generate-ember-blueprints --save', silent);
  // await execAbort.async(figRun + 'npm i lodash --save', silent);
  // await execAbort.async(figRun + 'npm i pluralize --save', silent);
  // await execAbort.async(figRun + 'sails generate ember-blueprints', silent);
  await dockerExec('npm i sails-generate-ember-blueprints --save', options.docker, silent);
  await dockerExec('npm i lodash --save', options.docker, silent);
  await dockerExec('npm i pluralize --save', options.docker, silent);
  await dockerExec('sails generate ember-blueprints', options.docker, silent);

  if (options.database === 'postgres') {
    // await execAbort.async(figRun + 'npm i --save sails-postgresql', silent);
    await dockerExec('npm i --save sails-postgresql', options.docker, silent);
  } else if (options.database !== 'disk') {
    // await execAbort.async(figRun + 'npm i --save sails-' + options.database, silent);
    await dockerExec('npm i --save sails-' + options.database, options.docker, silent);
  }

  //cd back out again
  if (!options.docker) {
    cd('..');
  }

  progress.stop();
  console.log(chalk.green('Installed Sails packages for tooling via npm.') + '\n');
  //Creating new ember project
  // await execAbort.async('ember new client', silent, 'Error: Creating a new Ember Project failed',
  //   'Creating Ember Project, installing bower and npm dependencies',
  //   'Ember Project successfully created.');

  console.log(chalk.green('Setting up Ember project locally.'));
  process.stdout.write('ember-cli ');
  await spawnPromise('ember', ['new', 'client', '--skip-git'], { stdio: 'inherit', env: process.env });

  //copy over prepared files
  console.log('!!!!!');
  var templates = getTemplates(projectMeta.sanePath());
  console.log(templates);
  for (var i = 0; i < templates.length; i++) {
    var templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
    var templateOutPath = renameTemplate(templates[i]);
    if (templates[i].indexOf('_') > -1) {
      fs.writeFileSync(templateOutPath, prepareTemplate(templates[i], { database: options.database, migrateType: 'safe' }));
    } else {
      fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
    }
  }
  console.log(chalk.green('Sane Project \'' + name + '\' successfully created.'));
};