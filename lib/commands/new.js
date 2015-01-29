'use strict';

var execAbort = require('../execAbort');
var projectMeta = require('../projectMeta');
var fs = require('fs-extra');
var hbs = require('handlebars');
var path = require('path');
var getTemplates = require('../tasks/getTemplates');
var renameTemplate = require('../tasks/renameTemplate');
var trackCommand = require('../tasks/trackCommand');
var PleasantProgress = require('pleasant-progress');
var chalk = require('chalk');
var checkEnvironment = require('../tasks/checkEnvironment');
var spawnPromise = require('superspawn').spawn;
var execPromise = require('child-process-promise').exec;
var {question} = require('readline-sync');
var projectMeta = require('../projectMeta');
require('shelljs/global');
var getAppNames = require('../tasks/getAppNames');


var serverName = getAppNames.server();
var clientName = getAppNames.client();


function normalizeOption(option) {
  if (option === 'mongodb') {
    return 'mongo';
  }
  if (option === 'postgres') {
    return 'postgresql';
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
    case 'postgresql':
      figPort = 5432;
      figDatabase = 'postgres';
    break;
    case 'mongo':
      figPort = 27017;
      break;
    case 'redis':
      figPort = 6379;
      figDatabase = 'redis';
    break;
  }

  var figVariables = { database: figDatabase, port: figPort, isMysql: figIsMysql, serverName: serverName};
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
function dockerExec(cmd, runsWithDocker, silent, dryRun) {
  if (silent === undefined) {
    silent = false;
  }

  if (dryRun === undefined) {
    dryRun = false;
  }

  var options = { stdio: 'inherit', env: process.env };
  if (silent) {
    options = { env: process.env };
  }

  var cmdMain;
  var cmdArgs;
  var cmds = cmd.split(' ');

  if (runsWithDocker) {
    cmdMain = 'fig';
    cmdArgs = ['run', serverName].concat(cmds);
  } else {
    cmdMain = cmds[0];
    cmdArgs = cmds.slice(1);
    //Note(markus): this assumes that dockerExec is only used for executing serverCommands
    options.cwd = serverName;
  }

  if (dryRun) {

    //simulate an npm i --save dry-run, since npm does not currently have that
    if (cmds[0] === 'npm' &&
    (cmds[1] === 'i' || cmds[1] === 'install')) {
      var filename = path.join(serverName, 'package.json');
      var packageInfo = fs.readFileSync(filename);
      var content = JSON.parse(packageInfo);
      for (var i = 2; i <= cmds.length; i++) {
        if (cmds[i] !== '--save') {
          content.dependencies[cmds[i]] = '*';
        }
      };
      //have to return a promise
      return new Promise(
        function(resolve, reject) {
          fs.writeFileSync(filename, JSON.stringify(content, null, 2));
          resolve();
      });
    }

    //return an empty promise
    return new Promise(
      function(resolve, reject) {
        resolve();
    });
  } else {
    return spawnPromise(cmdMain, cmdArgs, options);
  }
}

function getMigrateType(database) {
  var migrateType = 'safe';
  switch (database) {
    case 'mysql':
      migrateType = 'alter';
      break;
    case 'postgresql':
      migrateType = 'alter';
      break;
    case 'mongo':
      migrateType = 'safe';
      break;
    case 'redis':
      migrateType = 'safe';
      break;
  }

  return migrateType;
}

function isWrongProjectName(name) {
  if(name.includes('.') && name.length > 1){
    return true;
  }
  return false;
}

function cleanUpSails(options, silent){
  //clean up sails to be API only
  fs.removeSync(path.join('server', 'views'));
  fs.removeSync(path.join('server', 'tasks'));
  fs.removeSync(path.join('server', 'Gruntfile.js'));

  var sailsPackages = ['grunt', 'ejs', 'grunt-contrib-clean', 'grunt-contrib-concat',
  'grunt-contrib-copy', 'grunt-contrib-cssmin', 'grunt-contrib-jst', 'grunt-contrib-less',
  'grunt-contrib-uglify', 'grunt-contrib-watch', 'grunt-sails-linker', 'grunt-sync'];

  return dockerExec(`npm rm ${sailsPackages.join(' ')} --save`, options.docker, silent);
}

module.exports = async function newProject(name, options, leek) {
  var ember;
  //use global ember-cli if exists, otherwise the local one
  //TODO(markus): If global version differs from local one, then ask which one to use
  var localEmber = path.join(__dirname, '..', '..', 'node_modules', 'ember-cli', 'bin', 'ember');
  if (!checkEnvironment.emberExists()) {
    ember = localEmber;
  } else {
    ember = 'ember';
    //compare the different ember versions
    //slices out only the version number from global ember:
    var emberVersion = exec(`${ember} version`, { silent: true }).output.slice(9, 16).trim();
    // var localEmberVersion = exec(`${localEmber} version`, { silent: true }).output
    // var globalEmber = path.relative(process.cwd(), path.join(exec('npm root -g', { silent: true }).output, 'ember-cli', 'package.json'));
    // var emberVersion = require(globalEmber).version;
    var localEmberVersion = require(path.join(__dirname, '..', '..', 'node_modules', 'ember-cli', 'package.json')).version;
    if ( emberVersion !== localEmberVersion){
      var answer = question(chalk.gray(`Detected different versions for sane's locally installed ember-cli (${localEmberVersion}) and your global one (${emberVersion}). Want to use sane's one? (y/n):`) + '  (y) ') || 'y';
      if (answer === 'y' || answer === 'Y') {
        ember = localEmber;
      }
    }
  }

  var installMsg;
  //--docker is set
  if (options.docker) {
    installMsg = 'Setting up Sails project and downloading latest Docker Containers.';
    if (!checkEnvironment.dockerExists()) {
      console.log('sane requires the latest docker/boot2docker/fig to be installed. Check https://github.com/artificialio/sane/blob/master/README.md for more details.');
      console.log('Exitting now.');
      process.exit(1);
    }
  } else {
    installMsg = 'Setting up Sails project locally.';
    if (!checkEnvironment.sailsExists()) {
      console.log('sane requires the latest sails to be installed. Run npm install -g ember-cli.');
      console.log('Exitting now.');
      process.exit(1);
    }
  }

  if(isWrongProjectName(name)) {
    throw new Error(`Sane currently does not support a projectname of '${name}'.`);
  }

  options.database = normalizeOption(options.database);
  var silent = true;
  if (options.verbose) {
    silent = false;
  }

  //All checks are done, log command to analytics, then start command
  //when running tests leek will be undefined
  if (typeof leek !== 'undefined') {
    trackCommand(`new ${name}`, options, leek);
  }

  console.log(`Sane version: ${projectMeta.version()}\n`);

  //if . is passed it creates a new project in the current folder with the name taken from the parent
  if (name !== '.') {
    //Creates the new folder
    execAbort.sync('mkdir ' + name,
      'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.',
      silent);
    //change directories into projectRoot
    cd(name);
  }

  var projectName = path.basename(process.cwd());

  fs.writeFileSync(path.join('fig.yml'), prepareFigTemplate('fig.yml', options.database));
  fs.writeFileSync(path.join('package.json'), prepareTemplate('package.json', { name: projectName, version: projectMeta.version() }));

  var cliConfig = {};
  for (var opt in options) {
    //exclude properties that are not cli options
    if (options.hasOwnProperty(opt) &&
      !opt.startsWith('_') &&
      ['commands', 'options', 'parent'].indexOf(opt) === -1) {
      cliConfig[opt] = options[opt];
  }

  cliConfig['apps'] = [clientName, serverName];
  cliConfig['disableAnalytics'] = false;
}

  //creating a default .sane-cli based on the parameters used in the new command
  fs.writeFileSync(path.join('.sane-cli'), JSON.stringify(cliConfig, null, 2));

  mkdir(serverName);

  //TODO(markus): If we use spawn with stdio inherit we can print the proper output for fog
  //should also fix the ember-cli output
  console.log(chalk.green(installMsg));

  if (!options.docker) {
    process.stdout.write(`sails version: ${exec('sails version', { silent: true }).output}`);
  } else {
    process.stdout.write(`sails version: ${exec('fig run server sails version', { silent: true }).output}`);
  }

  await dockerExec('sails new .', options.docker);

  if (!options.skipNpm) {
    var progress = new PleasantProgress();
    progress.start(chalk.green('Installing Sails packages for tooling via npm.'));
  }

  var sailsPackages = ['sails-generate-ember-blueprints', 'lodash',
  'morgan', 'pluralize', `sails-${options.database}`];
  await dockerExec(`npm i ${sailsPackages.join(' ')} --save`, options.docker, silent, options.skipNpm);
  await dockerExec('sails generate ember-blueprints', options.docker, silent, options.skipNpm);

  if (!options.skipNpm) {
    progress.stop();
    console.log(chalk.green('Installed Sails packages for tooling via npm.') + '\n');
  } else {
    console.log(chalk.yellow('Warning: skipping npm tooling so you have to manually run the sails generator:'));
    console.log(chalk.yellow(`'sails-generate-ember-blueprints' (${chalk.underline('https://github.com/mphasize/sails-generate-ember-blueprints')})\n`));
  }

  //Creating new ember project
  console.log(chalk.green('Setting up Ember project locally.'));

  var emberArgs = ['new', clientName, '--skip-git'];

  if (options.skipNpm) {
    emberArgs.push('--skip-npm');
  }

  if (options.skipBower) {
    emberArgs.push('--skip-bower');
  }

  process.stdout.write('ember-cli ');
  await spawnPromise(ember, emberArgs, { stdio: 'inherit', env: process.env });

  progress.start(chalk.green('Running tooling scrips for Sane.'));

  //copy over template files
  var templates = getTemplates(projectMeta.sanePath());
  for (var i = 0; i < templates.length; i++) {
    var templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
    var templateOutPath = renameTemplate(templates[i]);
    if (templates[i].indexOf('_models') > -1) {
      fs.writeFileSync(templateOutPath, prepareTemplate(templates[i],
        { database: options.database, migrateType: getMigrateType(options.database) }));
    } else if (templates[i].indexOf('_connections') > -1) {
      var host = 'localhost';
      if (options.docker) {
        host = 'db';
      }
      fs.writeFileSync(templateOutPath, prepareTemplate(templates[i],
        { host: host }));
    } else {
      fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
    }
  }

  await cleanUpSails(options, silent);

  await spawnPromise('npm', ['install'], { env: process.env });

  progress.stop();
  console.log(chalk.green('Sane Project \'' + projectName + '\' successfully created.'));
};
