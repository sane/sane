'use strict';

/*
 * Prepares templates starting with _ to be copied over
 */

module.exports = function renameTemplate(name) {
  var lo = name.indexOf('_');
  if(lo > -1){
    return name.slice(0, lo) + name.slice(lo + 1);
  } else {
    return name;
  }
};