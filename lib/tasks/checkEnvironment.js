'use strict';

/*
 * Check things like DOCKER_HOST is set, docker/boot2docker/fig (depending on OS), sails and/or ember installed
 * Also used to return the right docker IP if used
 */
var which = require('which').sync;

var _require = require('child_process');

var execSync = _require.execSync;

var self = {
  /*
   *  OSX and windows need boot2docker installed. Other Unix systems do not.
   * process.platform can return: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
   */
  dockerExists: function dockerExists() {
    try {
      which('fig');
    } catch (err) {
      try {
        which('docker-compose');
      } catch (err) {
        return false;
      }
    }

    try {
      which('docker');
    } catch (err) {
      return false;
    }

    // check for windows or Mac OSX
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      return self.boot2dockerExists();
    }
    return true;
  },

  // only use this function for windows and mac
  boot2dockerExists: function boot2dockerExists() {
    try {
      which('boot2docker');
      return true;
    } catch (err) {
      return false;
    }
  },

  isDockerRunning: function isDockerRunning() {
    var running;
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      var stdout = execSync('boot2docker status', { encoding: 'utf-8' });
      if (stdout.trim() === 'running') {
        running = true;
      } else {
        running = false;
      }
    } else {
      try {
        execSync('docker info', { encoding: 'utf-8' });
        running = true;
      } catch (err) {
        running = false;
      }
    }
    return running;
  },

  emberExists: function emberExists() {
    try {
      execSync('npm', ['ls', '--global', '--depth=0', 'ember-cli']);
      return true;
    } catch (err) {
      return false;
    }
  },

  sailsExists: function sailsExists() {
    try {
      which('sails');
      return true;
    } catch (err) {
      return false;
    }
  },

  getDockerIp: function getDockerIp() {
    if (self.dockerExists() && self.isDockerRunning()) {
      var ip = process.env.DOCKER_HOST;
      // expects DOCKER_HOST to be of format: 'tcp://0.0.0.0:0'
      ip = ip.slice(ip.lastIndexOf('/') + 1, ip.lastIndexOf(':'));
      // simple check for valid ip
      if (ip.length > 6) {
        return ip;
      }
    }
    return '';
  }
};

module.exports = self;