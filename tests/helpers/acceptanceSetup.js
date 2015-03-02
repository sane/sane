'use strict';

var { execFile }  = require('child-process-promise');
var { spawn }  = require('child-process-promise');
var path = require('path');
var root = process.cwd();
var saneExec = (process.platform === 'win32' ? 'sane.cmd' : 'sane');

var self = {
  root: root,

  tmproot: path.join(root, 'tmp'),

  sane: path.join(root, 'bin', saneExec),,

  //TODO(Markus): Try to remove execFile/exec and call the cli directly, promisified
  initApp: function(args) {
    var args = args || ['new', '.', '--skip-npm', '--skip-bower', '--skip-analytics', '--verbose'];
    //Note: execFile is slightly more efficientl; Might have to use spawn on windows with var opts = { stdio: 'ignore' };
    return spawn(self.sane, args, { stdio: 'inherit' });
    // return execFile(self.sane, args);
  }
};

module.exports = self;
