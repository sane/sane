'use strict';

/*
 * filters out templates in given folderpath, taking only files with given nameBegins
 * and filtering out the ones that don't match nameEnds
 * Currently only taking js filesi into consideration.
 */

var walkSync = require('walk-sync');
var path = require('path');
require('shelljs/global');
// require('es6-shim');

module.exports = function getTemplates(folderPath) {
  var walked = walkSync(path.join(folderPath, 'templates'));

  //Only leave files (plus their relative path) in the walked array
  var walkedFiles = walked.filter(function(element){
    return element.indexOf('.') > 0;
  });

  //remove any root files, since they will be copied over at the beginning
  //NOTE(markus): Not sure if that works on Windows
  walkedFiles = walkedFiles.filter(function(element){
    return element.indexOf('/') > 0;
  });

  return walkedFiles;
};