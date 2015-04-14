var { spawn }     = require('child-process-promise');
var npmInstall    = require('enpeem').install;
var fs            = require('fs-extra');
var path          = require('path');

var dockerCompose = require('../../helpers/dockerCompose')();


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

    console.log('creating Promise');

    var promise = new Promise(function (resolve) { //reject
      console.log('executing blueprint!');
      blueprint.client.exec({
        success: async function (actions) {
          console.log('success!');
          //only install ember-addons addons if --skip-npm is not set
          if (!options.skipNpm) {
            for (var emberAddon of actions.addEmberAddons) {
              var addonSemVer = emberAddon.name + '@' + emberAddon.target;
              var emberArgs = ['install:addon', addonSemVer];
              try {
                await spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });
              } catch (error) {
                console.log(error.message);
                console.log(error.stack);
                throw error;
              }
            }
          }

          console.log('back here now?');

          for (var generate of actions.generates) {
            emberArgs = ['generate', generate.type, generate.name, generate.parameters];
            await spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });
          }

          console.log('or is it crapping now here?');

          //if addToConfig exists parse the ember-cli environment.js and add the new variables
          //to the end of the function just before the return ENV; statement
          //UNIT/ACCEPTANCE TEST THAT!
          if (actions.addToConfig) {
            var environmentPath = path.join(projectRoot, 'client', 'config', 'environment.js');
            var environment = fs.readFileSync(environmentPath, { encoding: 'utf8' });
            var endOfFunction = environment.indexOf('return ENV;');
            var addKeys = Object.keys(actions.addToConfig.ENV);

            var configToAddgString = '';
            for (var i = 0, len = addKeys.length; i < len; i++) {
              configToAddgString += `ENV[\'${addKeys[i]}\'] = ${JSON.stringify(actions.addToConfig.ENV[addKeys[i]], null, 2)};\n\n`;
            }

            var newEnvironment = environment.slice(0, endOfFunction) + configToAddgString + environment.slice(endOfFunction);

            fs.writeFileSync(environmentPath, newEnvironment);
          }

          console.log('resolve your promise baby!');
          resolve();

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

    var promise = new Promise(function (resolve) { // reject
      blueprint.server.exec({
        success: async function(actions) {
          var packageSemVers = [];
          for (var npmPackage of actions.addNpmPackages) {
            packageSemVers.push(npmPackage.name + '@' + npmPackage.target);
          }
          if (packageSemVers.length > 0) {

            var cmdPrefix = false;

            if (options.docker) {
              cmdPrefix = `${dockerCompose} run server`;
            }

            var installOptions = {
              dependencies: packageSemVers,
              // skip: options.skip,
              dryRun: options.skipNpm,
              save: true,
              // needed for optional docker
              cmdPrefix: cmdPrefix,
              // saves in the server file
              prefix: serverName
            };
            await npmInstall(installOptions);
          }

          resolve();
        }
      });
    });

    return promise;
  }
};
