'use strict';

var { execFile }  = require('child-process-promise');
var path = require('path');
var root = process.cwd();

var self = {
  root: root,

  tmproot: path.join(root, 'tmp'),

  sane: path.join(root, 'bin', 'sane'),

  //TODO(Markus): Try to remove execFile/exec and call the cli directly, promisified
  initApp: function(args) {
    var args = args || ['new', '.', '--skip-npm', '--skip-bower', '--skip-analytics', '--verbose'];
    return execFile(self.sane, args);
  }
};

module.exports = self;
