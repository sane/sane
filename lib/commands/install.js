'use strict';

// var installNpmPackage = require('../tasks/installNpmPackage');
var npmInstall = require('enpeem').install;
//automatically detects --verbose flag
var generate = require('./generate');
var chalk = require('chalk');

module.exports = function install(addonNames, options, leek) {
  var npmOptions, _iterator, _isArray, _i, _ref, addonName, atPos;

  return regeneratorRuntime.async(function install$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        npmOptions = {
          dependencies: addonNames,
          // dryRun: options.skipNpm,
          saveDev: true
        };
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return npmInstall(npmOptions);

      case 5:
        context$1$0.next = 12;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t2 = context$1$0['catch'](2);

        console.log(chalk.red(context$1$0.t2.message));
        console.log(context$1$0.t2.stack);
        throw context$1$0.t2;

      case 12:
        _iterator = addonNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

      case 13:
        if (!_isArray) {
          context$1$0.next = 19;
          break;
        }

        if (!(_i >= _iterator.length)) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt('break', 32);

      case 16:
        _ref = _iterator[_i++];
        context$1$0.next = 23;
        break;

      case 19:
        _i = _iterator.next();

        if (!_i.done) {
          context$1$0.next = 22;
          break;
        }

        return context$1$0.abrupt('break', 32);

      case 22:
        _ref = _i.value;

      case 23:
        addonName = _ref;
        atPos = addonName.indexOf('@');

        if (atPos > -1) {
          // cut out the @ and use the semVer instead of the *
          addonName = addonName.slice(0, atPos);
        } else {
          addonName = addonName;
        }

        console.log('' + addonName + ' succesfully installed. Running it\'s default generator now...');

        context$1$0.next = 29;
        return generate(addonName, '', '', {
          force: options.force || false,
          docker: options.docker || false,
          skipNpm: options.skipNpm || false
        }, leek);

      case 29:

        console.log('' + addonName + ' generator succesfully set up.');

      case 30:
        context$1$0.next = 13;
        break;

      case 32:
        context$1$0.next = 39;
        break;

      case 34:
        context$1$0.prev = 34;
        context$1$0.t3 = context$1$0['catch'](0);

        console.log(chalk.red(context$1$0.t3.message));
        console.log(context$1$0.t3.stack);
        throw context$1$0.t3;

      case 39:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 34], [2, 7]]);
};

// verbose.log(addonNames);
// verbose.log(options);
//if (typeof leek !== 'undefined') {
//  trackCommand(`install ${addonName}`, options, leek);
//}

//Note currently only supports installing one addon at a time.

// await exec(`sane generate ${pkgName}`);
// console.log('Addon succesfully installed.');