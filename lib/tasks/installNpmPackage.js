'use strict';

/*
* filters out templates in given folderpath, taking only files with given nameBegins
* and filtering out the ones that don't match nameEnds
* Currently only taking js filesi into consideration.
*/

var npm = require('npm');

module.exports = function installNpmPackage(packageNames, options, npmOptions) {
  return new Promise(function(resolve, reject) {
    var npmOptions = npmOptions || {
      loglevel: options.verbose ? 'verbose' : 'error',
      //logstream: this.ui.outputStream,
      color: 'always',
      'save-dev': true,
      'save-exact': true
    };
    npm.load(npmOptions, function(err) {
      if (err) {
        reject(err);
      } else {
        npm.commands.install(packages, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    }
  }
};
