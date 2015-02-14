'use strict';

var installNpmPackage = require('../tasks/installNpmPackage');

module.exports = async function install(addonNames, options, leek) {
  console.log(addonNames);
  //if (typeof leek !== 'undefined') {
  //  trackCommand(`install ${addonName}`, options, leek);
  //}
  try {
    var success = await installNpmPackage(addonNames, options);
    console.log(success);

    console.log(`${success} succesfully installed. Running it's default generator now...`);
    //await exec(`sane generate ${pkgName}`);
    console.log('All sueccesfully run');
  } catch(e) {
    console.log(e);
  }
};
