'use strict';

var installNpmPackage = require('../tasks/installNpmPackage');
//automatically detects --verbose flag
var verbose = require('verboser');
var generate = require('./generate');

module.exports = async function install(addonNames, options, leek) {
  // verbose.log(addonNames);
  // verbose.log(options);
  //if (typeof leek !== 'undefined') {
  //  trackCommand(`install ${addonName}`, options, leek);
  //}
  try {
    verbose.log('Installing npm package.');
    //Note currently only supports installing one addon at a time.
    var installedAddon = await installNpmPackage(addonNames);
    // console.log(success);

    console.log(`${installedAddon} succesfully installed. Running it's default generator now...`);
    await generate(installedAddon, '', '', {
      force: options.force || false,
      docker: options.docker || false,
      skipNpm: options.skipNpm || false
      }, leek);
    console.log(`${installedAddon} generator succesfully set up.`);
    // await exec(`sane generate ${pkgName}`);
    // console.log('Addon succesfully installed.');
  } catch(e) {
    console.log(e);
  }
};
