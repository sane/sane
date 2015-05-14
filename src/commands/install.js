'use strict';

// var installNpmPackage = require('../tasks/installNpmPackage');
var npmInstall    = require('enpeem').install;
// automatically detects --verbose flag
var generate      = require('./generate');
var chalk         = require('chalk');

module.exports = async function install(addonNames, options, leek) {
  // verbose.log(addonNames);
  // verbose.log(options);
  // if (typeof leek !== 'undefined') {
  //   trackCommand(`install ${addonName}`, options, leek);
  // }
  try {
    // Note currently only supports installing one addon at a time.
    var npmOptions = {
      dependencies: addonNames,
      // dryRun: options.skipNpm,
      saveDev     : true
    };

    try {
      await npmInstall(npmOptions);
    } catch (error) {
      console.log(chalk.red(error.message));
      console.log(error.stack);
      throw error;
    }

    for (let addonName of addonNames) {

      var atPos = addonName.indexOf('@');
      if (atPos > -1) {
        // cut out the @ and use the semVer instead of the *
        addonName = addonName.slice(0, atPos);
      } else {
        addonName = addonName;
      }

      console.log(`${addonName} succesfully installed. Running it's default generator now...`);

      await generate(addonName, '', '', {
        force  : options.force || false,
        docker : options.docker || false,
        skipNpm: options.skipNpm || false
        }, leek);

      console.log(`${addonName} generator succesfully set up.`);
    }

    // await exec(`sane generate ${pkgName}`);
    // console.log('Addon succesfully installed.');
  } catch (error) {
    console.log(chalk.red(error.message));
    console.log(error.stack);
    throw error;
  }
};
