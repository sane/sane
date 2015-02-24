'use strict';

var installNpmPackage = require('../tasks/installNpmPackage');
//automatically detects --verbose flag
var verbose = require('verboser');

module.exports = async function install(addonNames, options, leek) {
  // verbose.log(addonNames);
  // verbose.log(options);
  //if (typeof leek !== 'undefined') {
  //  trackCommand(`install ${addonName}`, options, leek);
  //}
  try {
    var pkgName = await installNpmPackage(addonNames);
    // console.log(success);

    console.log(`${pkgName} succesfully installed. Running it's default generator now...`);
    await exec(`sane generate ${pkgName}`);
    // console.log('Addon succesfully installed.');
  } catch(e) {
    console.log(e);
  }
};
