'use strict';

/*
* filters out templates in given folderpath, taking only files with given nameBegins
* and filtering out the ones that don't match nameEnds
* Currently only taking js filesi into consideration.
*/

var { installPackage } = require('machinepack-npm');
var { exec }   = require('child-process-promise');

module.exports = function installNpmPackage(packageNames, options, npmOptions) {
  options = options || { saveDev: true };
  return new Promise(function(resolve, reject) {
    // var npmOptions = npmOptions || {
    //   loglevel: options.verbose ? 'verbose' : 'error',
    //   //logstream: this.ui.outputStream,
    //   color: 'always',
    //   'save-dev': true,
    //   'save-exact': true
    // };
    installPackage({
      name: packageNames[0],
      saveDev: options.saveDev || false,
      save: options.save || false,
      prefix: options.prefix || false
    }).exec({
      error: function(err) {
        reject(err);
        return;
      },
      success: function(pkgName) {
        resolve(pkgName);
        return;
        console.log(`${pkgName} succesfully installed. Running it's default generator now...`);
        //TODO: now just run 'sane generate pkgName';
        //await exec(`sane generate ${pkgName}`);
        console.log('All sueccesfullt run');
      }
    });
  });
};
