'use strict';

var chalk = require('chalk');
var checkEnvironment = require('../tasks/checkEnvironment');
var dockerCompose = require('../helpers/dockerCompose')();
var fs = require('fs-extra');
var getAppNames = require('../tasks/getAppNames');
var getTemplates = require('../tasks/getTemplates');
var hbs = require('handlebars');
var npm = require('../helpers/npm');
var path = require('path');
var PleasantProgress = require('pleasant-progress');
var projectMeta = require('../projectMeta');

var _require = require('readline-sync');

var question = _require.question;

var renameTemplate = require('../tasks/renameTemplate');
var trackCommand = require('../tasks/trackCommand');

var _require2 = require('child-process-promise');

var spawn = _require2.spawn;

var log = require('captains-log')();
var sails = require('../helpers/sails');

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

function prepareTemplate(name, variables) {
  var template = fs.readFileSync(path.join(projectMeta.sanePath(), 'templates', name), 'utf8');
  template = hbs.compile(template);
  return template(variables);
}

function prepareDockerTemplate(name, option, user) {
  var db = null;
  var dockerUser = null;
  var port = 0;
  var isMysql = false;

  if (option !== 'disk') {
    db = option;
  }

  if (user) {
    dockerUser = user;
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
    serverName: serverName,
    user: dockerUser
  });
}

/*
 * Make sure the executed commands work with docker enabled/disabled
 */
function dockerExec(cmd, runsWithDocker, silent, dryRun) {
  silent = silent || (silent = false);
  dryRun = dryRun || (dryRun = false);

  var options = { stdio: silent && 'ignore' || 'inherit' };
  var cmdMain;
  var cmdArgs;
  var cmds = cmd.split(' ');

  if (runsWithDocker) {
    cmdMain = dockerCompose;
    cmdArgs = ['run', serverName].concat(cmds);
  } else {
    cmdMain = process.platform === 'win32' ? cmds[0] + '.cmd' : cmds[0];
    cmdArgs = cmds.slice(1);
    // Note(markus): this assumes that dockerExec is only used for executing serverCommands
    options.cwd = serverName;
  }

  if (dryRun) {

    // simulate an npm i --save dry-run, since npm does not currently have that
    if (cmds[0] === 'npm' && (cmds[1] === 'i' || cmds[1] === 'install')) {
      var filename = path.join(serverName, 'package.json');
      var packageInfo = fs.readFileSync(filename);
      var content = JSON.parse(packageInfo);
      for (var i = 2; i < cmds.length; i++) {
        if (cmds[i] !== '--save') {
          var atPos = cmds[i].indexOf('@');
          if (atPos > -1) {
            // cut out the @ and use the semVer instead of the *
            content.dependencies[cmds[i].slice(0, atPos)] = cmds[i].slice(atPos + 1);
          } else {
            content.dependencies[cmds[i]] = '*';
          }
        }
      }
      // have to return a promise
      return new Promise(function (resolve) {
        fs.writeFileSync(filename, JSON.stringify(content, null, 2));
        resolve();
      });
    }

    // return an empty promise
    return new Promise(function (resolve) {
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
  if (name.includes('.') && name.length > 1) {
    return true;
  }
  return false;
}

function cleanUpSails(options, silent) {
  // clean up sails to be API only
  fs.removeSync(path.join('server', 'views'));
  fs.removeSync(path.join('server', 'tasks'));
  fs.removeSync(path.join('server', 'Gruntfile.js'));

  var sailsPackages = ['grunt', 'ejs', 'grunt-contrib-clean', 'grunt-contrib-concat', 'grunt-contrib-copy', 'grunt-contrib-cssmin', 'grunt-contrib-jst', 'grunt-contrib-less', 'grunt-contrib-uglify', 'grunt-contrib-watch', 'grunt-sails-linker', 'grunt-sync'];

  // only runs simple unbuilds, so does not need to run in docker,
  // since that only seems to cause errors if anything
  return dockerExec('npm rm ' + sailsPackages.join(' ') + ' --save', false, silent);
}

module.exports = function newProject(name, options, leek) {
  var ember, localEmber, localEmberVersion, emberVersion, answer, installMsg, silent, projectName, prepareOptions, resetDockerUser, cliConfig, opt, sailsVersion, sailsPackages, emberArgs, templates, templatesRoot, i, templateInPath, templateOutPath, host, pollingWatch;
  return regeneratorRuntime.async(function newProject$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        ember = process.platform === 'win32' ? 'ember.cmd' : 'ember';
        localEmber = path.join(__dirname, '..', '..', 'node_modules', '.bin', ember);
        localEmberVersion = require(path.join(__dirname, '..', '..', 'node_modules', 'ember-cli', 'package.json')).version;

        if (checkEnvironment.emberExists()) {
          context$1$0.next = 7;
          break;
        }

        ember = localEmber;
        context$1$0.next = 11;
        break;

      case 7:
        context$1$0.next = 9;
        return spawn(npm, ['ls', '--global', '--json', '--depth=0', 'ember-cli'], { capture: ['stdout'] }).then(function (result) {
          return result.dependencies['ember-cli'].version;
        }, function (err) {
          console.error(err);
        });

      case 9:
        emberVersion = context$1$0.sent;

        // compare the different ember versions
        if (emberVersion !== localEmberVersion) {
          answer = question(chalk.gray('Detected different versions for sane\'s locally installed ' + ('ember-cli (' + localEmberVersion + ') and your ') + ('global one (' + emberVersion + ').\n') + 'Want to use sane\'s local Ember? (y/n):') + '  (y) ') || 'y';

          if (answer === 'y' || answer === 'Y') {
            ember = localEmber;
          }
        }

      case 11:
        if (!options.docker) {
          context$1$0.next = 19;
          break;
        }

        installMsg = 'Setting up Sails project and downloading latest Docker Containers.';

        if (checkEnvironment.dockerExists()) {
          context$1$0.next = 15;
          break;
        }

        throw new Error('sane requires the latest docker/boot2docker/docker-compose to be installed. ' + 'Check https://github.com/artificialio/sane/blob/master/README.md for more details.');

      case 15:
        if (checkEnvironment.isDockerRunning()) {
          context$1$0.next = 17;
          break;
        }

        throw new Error('Make sure your docker/boot2docker is running');

      case 17:
        context$1$0.next = 22;
        break;

      case 19:
        installMsg = 'Setting up Sails project locally.';

        if (checkEnvironment.sailsExists()) {
          context$1$0.next = 22;
          break;
        }

        throw new Error('sane requires the latest sails to be installed. Run npm install -g sails.');

      case 22:
        if (!isWrongProjectName(name)) {
          context$1$0.next = 24;
          break;
        }

        throw new Error('Sane currently does not support a projectname of \'' + name + '\'.');

      case 24:

        options.database = normalizeOption(options.database);
        silent = true;

        if (options.verbose) {
          silent = false;
        }

        // All checks are done, log command to analytics, then start command
        // when running tests leek will be undefined
        if (typeof leek !== 'undefined') {
          trackCommand('new ' + name, options, leek);
        }

        console.log('Sane version: ' + projectMeta.version() + '\n');

        if (!(name !== '.')) {
          context$1$0.next = 43;
          break;
        }

        context$1$0.prev = 30;

        fs.mkdirSync(name);
        // change directory into projectRoot
        process.chdir(name);
        context$1$0.next = 43;
        break;

      case 35:
        context$1$0.prev = 35;
        context$1$0.t4 = context$1$0['catch'](30);

        if (!(context$1$0.t4.code === 'EEXIST')) {
          context$1$0.next = 42;
          break;
        }

        context$1$0.t4.message = 'Creating a new folder failed. Check if the folder \'' + name + '\' already exists.';
        throw context$1$0.t4;

      case 42:
        throw context$1$0.t4;

      case 43:
        projectName = path.basename(process.cwd());
        prepareOptions = null;
        resetDockerUser = false;

        if (process.platform === 'linux') {
          prepareOptions = ['' + dockerCompose + '.yml.hbs', options.database, process.getuid()];
          resetDockerUser = true;
        } else {
          prepareOptions = ['' + dockerCompose + '.yml.hbs', options.database];
        }
        fs.writeFileSync(path.join('' + dockerCompose + '.yml'), prepareDockerTemplate.apply(null, prepareOptions));
        fs.writeFileSync(path.join('package.json'), prepareTemplate('package.json.hbs', { name: projectName, version: projectMeta.version() }));

        cliConfig = {};

        for (opt in options) {
          // exclude properties that are not cli options
          if (options.hasOwnProperty(opt) && !opt.startsWith('_') && ['commands', 'options', 'parent'].indexOf(opt) === -1) {
            cliConfig[opt] = options[opt];
          }
          cliConfig.apps = [clientName, serverName];
          cliConfig.disableAnalytics = false;
        }

        // creating a default .sane-cli based on the parameters used in the new command
        fs.writeFileSync(path.join('.sane-cli'), JSON.stringify(cliConfig, null, 2));
        context$1$0.prev = 52;

        fs.mkdirSync(serverName);
        context$1$0.next = 64;
        break;

      case 56:
        context$1$0.prev = 56;
        context$1$0.t5 = context$1$0['catch'](52);

        if (!(context$1$0.t5.code === 'EEXIST')) {
          context$1$0.next = 63;
          break;
        }

        context$1$0.t5.message = 'Creating a new folder failed. Check if the folder \'' + name + '\' already exists.';
        throw context$1$0.t5;

      case 63:
        throw context$1$0.t5;

      case 64:

        // TODO(markus): If we use spawn with stdio inherit we can print the proper output for fog
        // should also fix the ember-cli output
        console.log(chalk.green(installMsg));

        if (options.docker) {
          context$1$0.next = 71;
          break;
        }

        context$1$0.next = 68;
        return spawn(sails, ['version'], { capture: ['stdout'] }).then(function (result) {
          return result.stdout.toString();
        }, function (err) {
          console.log(err);
        });

      case 68:
        sailsVersion = context$1$0.sent;
        context$1$0.next = 74;
        break;

      case 71:
        context$1$0.next = 73;
        return spawn(dockerCompose, ['run', 'server', 'sails', 'version'], { capture: ['stdout'] }).then(function (result) {
          return result.stdout.toString();
        }, function (err) {
          console.log(err);
        });

      case 73:
        sailsVersion = context$1$0.sent;

      case 74:
        process.stdout.write('sails version: ' + sailsVersion);

        context$1$0.next = 77;
        return dockerExec('sails new .', options.docker);

      case 77:

        if (!options.skipNpm) {
          progress.start(chalk.green('Installing Sails packages for tooling via npm.'));
        }

        // npm install needs to be run as root, so if necessary remove the user from fig.yml
        if (resetDockerUser) {
          fs.writeFileSync(path.join('' + dockerCompose + '.yml'), prepareDockerTemplate('' + dockerCompose + '.yml.hbs', options.database));
        }

        sailsPackages = ['sails-generate-ember-blueprints', 'lodash', 'pluralize', 'sails-hook-autoreload@~0.11.4', 'sails-hook-dev@balderdashy/sails-hook-dev', 'sails-' + options.database];
        context$1$0.next = 82;
        return dockerExec('npm i ' + sailsPackages.join(' ') + ' --save', options.docker, silent, options.skipNpm);

      case 82:
        context$1$0.next = 84;
        return dockerExec('sails generate ember-blueprints', options.docker, silent, options.skipNpm);

      case 84:

        if (!options.skipNpm) {
          progress.stop();
          console.log(chalk.green('Installed Sails packages for tooling via npm.') + '\n');
        } else {
          console.log(chalk.yellow('Warning: skipping npm tooling so you have to manually run the sails generator:'));
          console.log(chalk.yellow('\'sails-generate-ember-blueprints\' (' + chalk.underline('https://github.com/mphasize/sails-generate-ember-blueprints') + ')\n'));
        }

        // Creating new ember project
        console.log(chalk.green('Setting up Ember project locally.'));

        emberArgs = ['new', clientName, '--skip-git'];

        if (options.skipNpm) {
          emberArgs.push('--skip-npm');
        }

        if (options.skipBower) {
          emberArgs.push('--skip-bower');
        }

        process.stdout.write('ember-cli ');
        context$1$0.next = 92;
        return spawn(ember, emberArgs, { stdio: 'inherit' });

      case 92:

        progress.start(chalk.green('Running tooling scripts for Sane.'));

        templates = getTemplates(projectMeta.sanePath());
        templatesRoot = templates.root;

        templates = templates.templates;
        for (i = 0; i < templates.length; i++) {
          templateInPath = path.join(templatesRoot, templates[i]);
          templateOutPath = renameTemplate(templates[i]);

          if (templates[i].indexOf('models.js.hbs') > -1) {
            fs.writeFileSync(templateOutPath, prepareTemplate(templates[i], { database: options.database, migrateType: getMigrateType(options.database) }));
          } else if (templates[i].indexOf('connections.js.hbs') > -1) {
            host = 'localhost';

            if (options.docker) {
              host = 'db';
            }
            fs.writeFileSync(templateOutPath, prepareTemplate(templates[i], { host: host }));
          } else if (templates[i].indexOf('autoreload.js.hbs') > -1) {
            pollingWatch = 'false';

            if (options.docker) {
              pollingWatch = 'true';
            }
            fs.writeFileSync(templateOutPath, prepareTemplate(templates[i], { pollingWatch: pollingWatch }));
          } else {
            fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
          }
        }

        context$1$0.prev = 97;
        context$1$0.next = 100;
        return cleanUpSails(options, silent);

      case 100:
        context$1$0.next = 106;
        break;

      case 102:
        context$1$0.prev = 102;
        context$1$0.t6 = context$1$0['catch'](97);

        console.log('Cleaning up Sails had some erros. Relax, your app is still working perfectly and shiny.');
        log.verbose('Error Message to report:', context$1$0.t6);

      case 106:
        if (options.skipNpm) {
          context$1$0.next = 116;
          break;
        }

        context$1$0.prev = 107;
        context$1$0.next = 110;
        return spawn(npm, ['install']);

      case 110:
        context$1$0.next = 116;
        break;

      case 112:
        context$1$0.prev = 112;
        context$1$0.t7 = context$1$0['catch'](107);

        console.log('Could not install local sane-cli. Manuall run \'npm install\' and all should be fine.');
        log.verbose('Error Message to report:', context$1$0.t7);

      case 116:

        progress.stop();
        console.log(chalk.green('Sane Project \'' + projectName + '\' successfully created.'));

      case 118:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[30, 35], [52, 56], [97, 102], [107, 112]]);
};

// take the local ember version from the package.json.

// Get globally installed ember version

// --docker is set
// If . is passed it creates a new project in the current folder
// with the name taken from the parent

// Create the new folder

// Linux systems need the non-root user to be specified in docker-compose.yml
// copy over template files
// TODO(markus): Try to refactor with copyToProject.js

// this is to install sane-cli locally
