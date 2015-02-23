'use strict';

var { execFile }  = require('child-process-promise');
var path = require('path');
var root = process.cwd();

var self = {
  root: root,

  tmproot: path.join(root, 'tmp'),

  saneExec: (process.platform === 'win32' ? 'sane.cmd' : 'sane');

  sane: path.join(root, 'bin', self.saneExec),

  //TODO(Markus): Try to remove execFile/exec and call the cli directly, promisified
  initApp: function(args) {
    var args = args || ['new', '.', '--skip-npm', '--skip-bower', '--skip-analytics', '--verbose'];
    //Note: execFile is slightly more efficientl; Might have to use spawn on windows with var opts = { stdio: 'ignore' }; 
    return execFile(self.sane, args);
  }
};

module.exports = self;
