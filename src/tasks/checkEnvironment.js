'use strict';

/*
 * Check things like DOCKER_HOST is set, docker/boot2docker/fig (depending on OS), sails and/or ember installed
 * Also used to return the right docker IP if used
 */
var which         = require('which').sync;
var { execSync, spawnSync }  = require('child_process');
var npm           = require('../helpers/npm');

var self = {
  /*
   *  OSX and windows need boot2docker installed. Other Unix systems do not.
   * process.platform can return: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
   */
  dockerExists: function () {
    try {
      // this should exist by default
      which('docker-compose');
    } catch (err) {
      try {
        // legacy executable as fallback
        which('fig');
      } catch (err) {
        return false;
      }
    }

    try {
      which('docker');
    } catch (err) {
      return false;
    }

    return true;
  },

  // only use this function for windows and mac
  // boot2docker is deprecated by docker-machine, however continue to check for legacy installations
  boot2dockerExists: function () {
    try {
      which('boot2docker');
      return true;
    } catch (err) {
      return false;
    }
  },

  dockerMachineExists: function () {
    try {
      which('docker-machine');
      return true;
    } catch (err) {
      return false;
    }
  },

  isDockerRunning: function () {
    var running = false;
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      var command;
      if (self.dockerMachineExists()) {
        if (process.env.DOCKER_MACHINE_NAME === undefined) {
          console.error('DOCKER environment variables are not set. see: https://docs.docker.com/machine/reference/env/');
          return running;
        }
        command = 'docker-machine status ' + process.env.DOCKER_MACHINE_NAME;
      } else if (self.boot2dockerExists()) {
        command = 'boot2docker status';
      }
      if (command) {
        var stdout = execSync(command, { encoding: 'utf-8' });
        running = stdout.trim().toLowerCase() === 'running';
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

  emberExists: function () {
    var res = spawnSync(npm, ['ls', '--global', '--json', '--depth=0', 'ember-cli']);
    var stdoutJSON = JSON.parse(res.stdout);

    if (stdoutJSON.dependencies && stdoutJSON.dependencies['ember-cli']) {
      return true;
    }

    return false;
  },

  sailsExists: function () {
    try {
      which('sails');
      return true;
    } catch (err) {
      return false;
    }
  },

  getDockerIp: function () {
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
