/*
 * filters out templates in given folderpath, taking only files with given nameBegins
 * and filtering out the ones that don't match nameEnds
 * Currently only taking js filesi into consideration.
 */

var walkSync = require('walk-sync');
var path = require('path');
require('string.prototype.endswith');
require('shelljs/global');

module.exports = function templatesEndingWith(folderPath, nameBegins, nameEnds) {
  var walked = walkSync(path.join(folderPath, 'templates'));

  //Only leave files (plus their relative path) in the walked array
  var walkedFiles = walked.filter(function(element){
    return element.indexOf('.') > 0;
  });

  //Filter out the right models file
  walkedFiles = walkedFiles.filter(function(fileName){
    if(fileName.indexOf(nameBegins) > 0){
      return fileName.endsWith(nameEnds + '.js');
    } else {
      return true;
    }
  });

  return walkedFiles;
};