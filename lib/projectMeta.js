'use strict';

var fs = require('fs-extra');
var path = require('path');
require('shelljs/global');

//TODO(markus): Needs some refactoring
//Try to implement these not as functions but as attributes of the object and set it at each sane call
//BUG: projectRoot changes when we do a cd() command
var self = {
  binaryPath: function() {
    return which('sane');
  },

  sanePath: function() {
    return self.binaryPath().slice(0, -4) + fs.readlinkSync(self.binaryPath()).slice(0, -4) + '../';
  },

  version: function() {
    return JSON.parse(fs.readFileSync(path.join(self.sanePath(), 'package.json'), 'utf8')).version;
  } //,

  // projectRoot: function() {
  //   return process.cwd();
  // },

  // serverRoot: function() {
  //   return path.join(self.projectRoot(), 'server');
  // },

  // clientRoot: function() {
  //   return path.join(self.projectRoot(), 'client')
  // }
};

module.exports = self;