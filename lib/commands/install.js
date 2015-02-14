'use strict';

var installNpmPackage = require('../tasks/installNpmPackage');

module.exports = function install(addonName, options, leek) {
  //if (typeof leek !== 'undefined') {
  //  trackCommand(`install ${addonName}`, options, leek);
  //}

  //try {
  await installNpmPackage(addonName, options);
  //} catch(ex) {

  //}
  console.log('install command not implemented yet.');
  console.log(options.pod);
  if(options.pod === 'true'){
    console.log('is true string');
  } else if(options.pod === 'false') {
    console.log('is false string');
  } else {
    console.log('yeeahh');
  }
};
