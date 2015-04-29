'use strict';

var _require = require('child-process-promise');

var spawn = _require.spawn;

var npmInstall = require('enpeem').install;
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var log = require('captains-log')();

var dockerCompose = require('../../helpers/dockerCompose')();
var ember = require('../../helpers/ember');
var createEmberConfig = require('./createEmberConfig');

module.exports = {
  /**
   * @overview This function executes the machine that is responsible for running client tasks
   *
   * @param {String} blueprintPath - path to the blueprint/addon
   * @param {Object} [options] - Options passed over by commander including all set flags such --verbose
   * @return {Promise} promise - So we know when everything has been executed.
   */
  client: function client(blueprintPath, projectRoot, clientName, options) {
    var blueprint = require(blueprintPath);

    var promise = new Promise(function (resolve, reject) {
      blueprint.client.exec({
        success: function success(actions) {
          var addonErrors, _iterator, _isArray, _i, _ref, emberAddon, addonSemVer, emberArgs, _iterator2, _isArray2, _i2, _ref2, generate, _createEmberConfig, environmentPath, newEnvironment;

          return regeneratorRuntime.async(function success$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                addonErrors = [];

                if (options.skipNpm) {
                  context$3$0.next = 29;
                  break;
                }

                _iterator = actions.addEmberAddons, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

              case 3:
                if (!_isArray) {
                  context$3$0.next = 9;
                  break;
                }

                if (!(_i >= _iterator.length)) {
                  context$3$0.next = 6;
                  break;
                }

                return context$3$0.abrupt('break', 29);

              case 6:
                _ref = _iterator[_i++];
                context$3$0.next = 13;
                break;

              case 9:
                _i = _iterator.next();

                if (!_i.done) {
                  context$3$0.next = 12;
                  break;
                }

                return context$3$0.abrupt('break', 29);

              case 12:
                _ref = _i.value;

              case 13:
                emberAddon = _ref;
                addonSemVer = emberAddon.name + '@' + emberAddon.target;
                emberArgs = ['install', addonSemVer];
                context$3$0.prev = 16;
                context$3$0.next = 19;
                return spawn(ember, emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });

              case 19:
                context$3$0.next = 27;
                break;

              case 21:
                context$3$0.prev = 21;
                context$3$0.t8 = context$3$0['catch'](16);

                console.log(chalk.red('Error with ember install.') + chalk.yellow(' Carrying on installation.'));
                log.verbose(chalk.red(context$3$0.t8.message));
                if (context$3$0.t8.stack) {
                  log.verbose(context$3$0.t8.stack);
                }
                addonErrors.push(context$3$0.t8);

              case 27:
                context$3$0.next = 3;
                break;

              case 29:
                _iterator2 = actions.generates, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

              case 30:
                if (!_isArray2) {
                  context$3$0.next = 36;
                  break;
                }

                if (!(_i2 >= _iterator2.length)) {
                  context$3$0.next = 33;
                  break;
                }

                return context$3$0.abrupt('break', 55);

              case 33:
                _ref2 = _iterator2[_i2++];
                context$3$0.next = 40;
                break;

              case 36:
                _i2 = _iterator2.next();

                if (!_i2.done) {
                  context$3$0.next = 39;
                  break;
                }

                return context$3$0.abrupt('break', 55);

              case 39:
                _ref2 = _i2.value;

              case 40:
                generate = _ref2;

                emberArgs = ['generate', generate.type, generate.name, generate.parameters];
                context$3$0.prev = 42;
                context$3$0.next = 45;
                return spawn(ember, emberArgs, { stdio: 'inherit', cwd: path.join(projectRoot, clientName) });

              case 45:
                context$3$0.next = 53;
                break;

              case 47:
                context$3$0.prev = 47;
                context$3$0.t9 = context$3$0['catch'](42);

                console.log(chalk.red('Error with ember generate.') + chalk.yellow(' Carrying on installation.'));
                log.verbose(chalk.red(context$3$0.t9.message));
                if (context$3$0.t9.stack) {
                  log.verbose(context$3$0.t9.stack);
                }
                addonErrors.push(context$3$0.t9);

              case 53:
                context$3$0.next = 30;
                break;

              case 55:

                //if addToConfig exists parse the ember-cli environment.js and add the new variables
                //to the end of the function just before the return ENV; statement
                //UNIT/ACCEPTANCE TEST THAT!
                if (actions.addToConfig) {
                  _createEmberConfig = createEmberConfig(projectRoot, actions.addToConfig);
                  environmentPath = _createEmberConfig[0];
                  newEnvironment = _createEmberConfig[1];

                  fs.writeFileSync(environmentPath, newEnvironment);
                }

                if (addonErrors.length > 0) {
                  reject(addonErrors);
                } else {
                  log.verbose('Client Machine Promise resolved.');
                  resolve();
                }

              case 57:
              case 'end':
                return context$3$0.stop();
            }
          }, null, this, [[16, 21], [42, 47]]);
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
  server: function server(blueprintPath, serverName, options) {
    var blueprint = require(blueprintPath);

    var promise = new Promise(function (resolve, reject) {
      blueprint.server.exec({
        success: function success(actions) {
          var packageSemVers, addonErrors, _iterator3, _isArray3, _i3, _ref3, npmPackage, cmdPrefix, prefix, installOptions;

          return regeneratorRuntime.async(function success$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                packageSemVers = [];
                addonErrors = [];
                _iterator3 = actions.addNpmPackages, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();

              case 3:
                if (!_isArray3) {
                  context$3$0.next = 9;
                  break;
                }

                if (!(_i3 >= _iterator3.length)) {
                  context$3$0.next = 6;
                  break;
                }

                return context$3$0.abrupt('break', 17);

              case 6:
                _ref3 = _iterator3[_i3++];
                context$3$0.next = 13;
                break;

              case 9:
                _i3 = _iterator3.next();

                if (!_i3.done) {
                  context$3$0.next = 12;
                  break;
                }

                return context$3$0.abrupt('break', 17);

              case 12:
                _ref3 = _i3.value;

              case 13:
                npmPackage = _ref3;

                packageSemVers.push(npmPackage.name + '@' + npmPackage.target);

              case 15:
                context$3$0.next = 3;
                break;

              case 17:
                if (!(packageSemVers.length > 0)) {
                  context$3$0.next = 33;
                  break;
                }

                cmdPrefix = false;
                prefix = serverName;

                if (options.docker) {
                  cmdPrefix = '' + dockerCompose + ' run server';
                  prefix = undefined;
                }

                installOptions = {
                  dependencies: packageSemVers,
                  // skip: options.skip,
                  dryRun: options.skipNpm,
                  save: true,
                  // needed for optional docker
                  cmdPrefix: cmdPrefix,
                  // saves in the server file
                  prefix: prefix
                };
                context$3$0.prev = 22;
                context$3$0.next = 25;
                return npmInstall(installOptions);

              case 25:
                context$3$0.next = 33;
                break;

              case 27:
                context$3$0.prev = 27;
                context$3$0.t10 = context$3$0['catch'](22);

                addonErrors.push(context$3$0.t10);
                console.log(chalk.red('Error with server npm install.') + chalk.yellow(' Carrying on installation.'));
                log.verbose(chalk.red(context$3$0.t10.message));
                if (context$3$0.t10.stack) {
                  log.verbose(context$3$0.t10.stack);
                }

              case 33:

                if (addonErrors.length > 0) {
                  reject(addonErrors);
                } else {
                  log.verbose('Client Machine Promise resolved.');
                  resolve();
                }

              case 34:
              case 'end':
                return context$3$0.stop();
            }
          }, null, this, [[22, 27]]);
        }
      });
    });

    return promise;
  }
};

//only install ember-addons addons if --skip-npm is not set