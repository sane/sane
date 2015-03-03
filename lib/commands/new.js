var chalk = require('chalk');
var checkEnvironment = require('../tasks/checkEnvironment');
var dockerCompose = require('../helpers/dockerCompose')();
var execAbort = require('../execAbort');
var fs = require('fs-extra');
var getAppNames = require('../tasks/getAppNames');
var getTemplates = require('../tasks/getTemplates');
var hbs = require('handlebars');
var npm = require('../helpers/npm');
var path = require('path');
var PleasantProgress = require('pleasant-progress');
var projectMeta = require('../projectMeta');
var projectMeta = require('../projectMeta');
var { question } = require('readline-sync');
var renameTemplate = require('../tasks/renameTemplate');
var trackCommand = require('../tasks/trackCommand');
require('shelljs/global');
var { spawn } = require('child-process-promise');
var log = require('captains-log')();

var serverName = getAppNames.server();
var clientName = getAppNames.client();
var progress = new PleasantProgress();

function normalizeOption(option) {
  if (option === 'mongodb') {
    return 'mongo';
  }
  if (option === 'postgres') {
    return 'postgresql';
  }
  return option;
}

function prepareDockerTemplate(name, option) {
  var db = null;
  var port = 0;
  var isMysql = false;

  if (option !== 'disk') {
    db = option;
  }

  switch (option) {
    case 'mysql':
      port = 3306;
      isMysql = true;
      break;
    case 'postgresql':
      port = 5432;
      db = 'postgres';
      break;
    case 'mongo':
      port = 27017;
      break;
    case 'redis':
      port = 6379;
      db = 'redis';
    break;
  }
  return prepareTemplate(name, {
    database: db,
    port: port,
    isMysql: isMysql,
    serverName: serverName
  })
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
  silent || (silent = false)
  dryRun || (dryRun = false)

  var options = { stdio: silent && 'ignore' || 'inherit' }
  var cmdMain;
  var cmdArgs;
  var cmds = cmd.split(' ');

  if (runsWithDocker) {
    cmdMain = dockerCompose;
    cmdArgs = ['run', serverName].concat(cmds);
  } else {
    cmdMain = (process.platform === 'win32' ? cmds[0] + '.cmd' : cmds[0]);
    cmdArgs = cmds.slice(1);
    //Note(markus): this assumes that dockerExec is only used for executing serverCommands
    options.cwd = serverName;
  }

  if (dryRun) {

    //simulate an npm i --save dry-run, since npm does not currently have that
    if (cmds[0] === 'npm' && (cmds[1] === 'i' || cmds[1] === 'install')) {
      var filename = path.join(serverName, 'package.json');
      var packageInfo = fs.readFileSync(filename);
      var content = JSON.parse(packageInfo);
      for (var i = 2; i < cmds.length; i++) {
        if (cmds[i] !== '--save') {
          var atPos = cmds[i].indexOf('@');
          if (atPos > -1) {
            //cut out the @ and use the semVer instead of the *
            content.dependencies[cmds[i].slice(0, atPos)] = cmds[i].slice(atPos + 1);
          } else {
            content.dependencies[cmds[i]] = '*';
          }
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
    return spawn(cmdMain, cmdArgs, options);
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

  //only runs simple unbuilds, so does not need to run in docker,
  //since that only seems to cause errors if anything
  return dockerExec(`npm rm ${sailsPackages.join(' ')} --save`, false, silent);
}

module.exports = async function newProject(name, options, leek) {
  var ember;
  //use global ember-cli if exists, otherwise the local one
  //TODO(markus): If global version differs from local one, then ask which one to use
  var localEmber = path.join(__dirname, '..', '..', 'node_modules', 'ember-cli', 'bin', 'ember');
  if (!checkEnvironment.emberExists()) {
    ember = localEmber;
  } else {
    ember = (process.platform === 'win32' ? 'ember.cmd' : 'ember');
    //regex to get semantic version string
    // var semVer = new RegExp(/([0-9]+\.[0-9]+\.[0-9]+)/);
    //semVer including beta version
    var semVer = new RegExp(/([0-9]+.[0-9]+.[0-9]+)(\-beta.[0-9])?/);
    //Gets the first version number that the global ember spits out.
    var emberVersion = exec(`${ember} version`, { silent: true }).output.match(semVer)[0];

    //Note(markus): Somehow do not seem to be able to get access to the globally installed ember-cli package.json
    // var globalEmber = path.relative(process.cwd(), path.join(exec('npm root -g', { silent: true }).output, 'ember-cli', 'package.json'));
    // var emberVersion = require(globalEmber).version;

    //take the local ember version from the package.json. Much faster
    var localEmberVersion = require(path.join(__dirname, '..', '..', 'node_modules', 'ember-cli', 'package.json')).version;
    //compare the different ember versions
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
      console.log('sane requires the latest docker/boot2docker/docker-compose to be installed. Check https://github.com/artificialio/sane/blob/master/README.md for more details.');
      console.log('Exitting now.');
      process.exit(1);
    }
  } else {
    installMsg = 'Setting up Sails project locally.';
    if (!checkEnvironment.sailsExists()) {
      console.log('sane requires the latest sails to be installed. Run npm install -g sails.');
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

  fs.writeFileSync(path.join(dockerCompose+'.yml'), prepareDockerTemplate(dockerCompose+'.yml', options.database));
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
    process.stdout.write(`sails version: ${exec(dockerCompose + ' run server sails version', { silent: true }).output}`);
  }

  await dockerExec('sails new .', options.docker);

  if (!options.skipNpm) {
    progress.start(chalk.green('Installing Sails packages for tooling via npm.'));
  }

  var sailsPackages = ['sails-generate-ember-blueprints', 'lodash', 'pluralize',
  'sails-hook-autoreload@~0.11.4', 'sails-hook-dev@^1.0.0', `sails-${options.database}`];
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
  await spawn(ember, emberArgs, { stdio: 'inherit' });

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
      fs.writeFileSync(templateOutPath, prepareTemplate(templates[i], { host: host }));
    } else if (templates[i].indexOf('_autoreload') > -1) {
      var pollingWatch = 'false';
      if (options.docker) {
        pollingWatch = 'true';
      }
      fs.writeFileSync(templateOutPath, prepareTemplate(templates[i],
        { pollingWatch: pollingWatch }));
    } else {
      fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
    }
  }

  try {
    await cleanUpSails(options, silent);
  } catch (err) {
    console.log('Cleaning up Sails had some erros. Relax, your app is still working perfectly and shiny.');
    log.verbose('Showing error Message to report:', err);
  }

  if (!options.skipNpm) {
    try {
      await spawn(npm, ['install']);
    } catch (err) {
      console.log('Could not install local sane-cli. Manuall run \'npm install\' and all should be fine.');
      log.verbose('Showing error Message to report:', err);
    }
  }

  progress.stop();
  console.log(chalk.green('Sane Project \'' + projectName + '\' successfully created.'));
};
