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
    return  path.resolve(__dirname , '../');
  },

  version: function() {
    return require(self.sanePath() + '/package.json').version;
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