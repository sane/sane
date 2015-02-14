'use strict';

/*
* filters out templates in given folderpath, taking only files with given nameBegins
* and filtering out the ones that don't match nameEnds
* Currently only taking js filesi into consideration.
*/

var npm = require('npm');
var npmInstall = require('machinepack-npm/installPackage');
var {exec}   = require('child-process-promise');

module.exports = function installNpmPackage(packageNames, options, npmOptions) {
  return new Promise(function(resolve, reject) {
    var npmOptions = npmOptions || {
      loglevel: options.verbose ? 'verbose' : 'error',
      //logstream: this.ui.outputStream,
      color: 'always',
      'save-dev': true,
      'save-exact': true
    };
    npmInstall({
      name: packageNames[0],
      saveDev: true
    }).exec({
      error: function(err) {

      },
      success: function(pkgName) {
        console.log(`${pkgName} succesfully installed. Running it's default generator now...`);
        //TODO: now just run 'sane generate pkgName';
        await exec(`sane generate ${pkgName}`);
        console.log('All sueccesfullt run');
      }
    });
  }
};
