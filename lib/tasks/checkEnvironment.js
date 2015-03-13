'use strict';

/*
 * Check things like DOCKER_HOST is set, docker/boot2docker/fig (depending on OS), sails and/or ember installed
 * Also used to return the right docker IP if used
 */
var shell    = require('shelljs');
var { exec } = require('child_process');

var self = {
  /*
   *  OSX and windows need boot2docker installed. Other Unix systems do not.
   * process.platform can return: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
   */
  dockerExists: function () {
    if (!(shell.which('fig') || shell.which('docker-compose')) || !shell.which('docker')) {
      return false;
    }
    //check for windows or Mac OSX
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      return self.boot2dockerExists();
    }
    return true;
  },

  //only use this function for windows and mac
  boot2dockerExists: function () {
    if (!shell.which('boot2docker')) {
      return false;
    }
    return true;
  },

  isDockerRunning: function () {
    var running;
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      running = exec('boot2docker status',
        function (error, stdout) {
          if (error) {
            throw error;
          }
          if (stdout.trim() === 'running') {
            return true;
          } else {
            return false;
          }
        }
      );
    } else {
      running = exec('docker info',
        function (error) {
          if (!error) {
            return true;
          } else {
            return false;
          }
        }
      );
    }
    return running;
  },

  emberExists: function () {
    if (!shell.which('ember')) {
      return false;
    }
    return true;
  },

  sailsExists: function () {
    if (!shell.which('sails')) {
      return false;
    }
    return true;
  },

  getDockerIp: function () {
    if (self.dockerExists() && self.isDockerRunning()) {
      var ip = process.env.DOCKER_HOST;
      //expects DOCKER_HOST to be of format: 'tcp://0.0.0.0:0'
      ip = ip.slice(ip.lastIndexOf('/') + 1, ip.lastIndexOf(':'));
      //simple check for valid ip
      if (ip.length > 6) {
        return ip;
      }
    }
    return '';
  }
};

module.exports = self;
