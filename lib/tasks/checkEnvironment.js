/*
 * Check things like DOCKER_HOST is set, docker/boot2docker/fig (depending on OS), sails and/or ember installed
 * Also used to return the right docker IP if used
 */
require('shelljs/global');

var self = {
  /*
   *  OSX and windows need boot2docker installed. Other Unix systems do not.
   * process.platform can return: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
   */
  dockerExists: function(){
    if (!which('fig') || !which('docker') || exec('docker info').code !== 0) {
      return false;
    }
    //check for windows or Mac OSX
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      if (!which('boot2docker')) {
        return false;
      }
    }
    return true;
  },
  ember: function() {
    if (!which('ember')) {
      console.log('sane requires the latest ember-cli to be installed. Run \'npm install -g ember-cli\' to install.');
      console.log('Exitting now.');
      exit(1);
    }
  },
  sails: function() {
    if (!which('sails')) {
      console.log('sane requires the latest SailsJS to be installed. Run \'npm install -g sails\' to install.');
      console.log('Exitting now.');
      exit(1);
    }
  },
  dockerIp: function() {
    if( self.docker() ) {
      var ip = process.env.DOCKER_HOST;
      //expects DOCKER_HOST to be of format: 'tcp://0.0.0.0:0'
      ip = ip.slice(ip.lastIndexOf('/') + 1, ip.lastIndexOf(':'));
      //simple check for valid ip
      if (ip.length > 6) {
        return ip;
      }
    }
    return null;
  }
};

module.exports = self;