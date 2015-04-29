var { spawn }         = require('child-process-promise');
var npmInstall        = require('enpeem').install;
var fs                = require('fs-extra');
var path              = require('path');
var chalk             = require('chalk');
var log               = require('captains-log')();


var dockerCompose     = require('../../helpers/dockerCompose')();
var ember             = require('../../helpers/ember');
var createEmberConfig = require('./createEmberConfig');


module.exports = {
  /**
   * @overview This function executes the machine that is responsible for running client tasks
   *
   * @param {String} blueprintPath - path to the blueprint/addon
   * @param {Object} [options] - Options passed over by commander including all set flags such --verbose
   * @return {Promise} promise - So we know when everything has been executed.
   */
  client: function (blueprintPath, projectRoot, clientName, options) {
    var blueprint = require(blueprintPath);

    var promise = new Promise(function (resolve, reject) {
      blueprint.client.exec({
        success: async function (actions) {
          var addonErrors = [];
          //only install ember-addons addons if --skip-npm is not set
          if (!options.skipNpm) {
            for (let emberAddon of actions.addEmberAddons) {
              var addonSemVer = emberAddon.name + '@' + emberAddon.target;
              var emberArgs = ['install', addonSemVer];
              try {
                await spawn(ember, emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });
              } catch (error) {
                console.log(chalk.red('Error with ember install.') + chalk.yellow(' Carrying on installation.'));
                log.verbose(chalk.red(error.message));
                if (error.stack) {
                  log.verbose(error.stack);
                }
                addonErrors.push(error);
              }
            }
          }

          for (var generate of actions.generates) {
            emberArgs = ['generate', generate.type, generate.name, generate.parameters];
            try {
              await spawn(ember, emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });
            } catch (error) {
              console.log(chalk.red('Error with ember generate.') + chalk.yellow(' Carrying on installation.'));
              log.verbose(chalk.red(error.message));
              if (error.stack) {
                log.verbose(error.stack);
              }
              addonErrors.push(error);
            }
          }

          //if addToConfig exists parse the ember-cli environment.js and add the new variables
          //to the end of the function just before the return ENV; statement
          //UNIT/ACCEPTANCE TEST THAT!
          if (actions.addToConfig) {
            var [environmentPath, newEnvironment] = createEmberConfig(projectRoot, actions.addToConfig);
            fs.writeFileSync(environmentPath, newEnvironment);
          }

          if (addonErrors.length > 0) {
            reject(addonErrors);
          } else {
            log.verbose('Client Machine Promise resolved.');
            resolve();
          }

        }
      });
    });

    return promise;
  },

  /**
   * @overview This function executes the machine that is responsible for running server tasks
   *
   * @param {String} blueprintPath - path to the blueprint/addon
   * @param {Object} [options] - Options passed over by commander including all set flags such --verbose
   * @return {Promise} promise - So we know when everything has been executed.
   */
  server: function (blueprintPath, serverName, options) {
    var blueprint = require(blueprintPath);

    var promise = new Promise(function (resolve, reject) {
      blueprint.server.exec({
        success: async function(actions) {
          var packageSemVers = [];
          var addonErrors = [];
          for (var npmPackage of actions.addNpmPackages) {
            packageSemVers.push(npmPackage.name + '@' + npmPackage.target);
          }
          if (packageSemVers.length > 0) {

            var cmdPrefix = false;
            var prefix = serverName;

            if (options.docker) {
              cmdPrefix = `${dockerCompose} run server`;
              prefix = undefined;
            }

            var installOptions = {
              dependencies: packageSemVers,
              // skip: options.skip,
              dryRun: options.skipNpm,
              save  : true,
              // needed for optional docker
              cmdPrefix: cmdPrefix,
              // saves in the server file
              prefix: prefix
            };

            try {
              await npmInstall(installOptions);
            } catch (error) {
              addonErrors.push(error);
              console.log(chalk.red('Error with server npm install.') + chalk.yellow(' Carrying on installation.'));
              log.verbose(chalk.red(error.message));
              if (error.stack) {
                log.verbose(error.stack);
              }
            }
          }

          if (addonErrors.length > 0) {
            reject(addonErrors);
          } else {
            log.verbose('Client Machine Promise resolved.');
            resolve();
          }
        }
      });
    });

    return promise;
  }
};
