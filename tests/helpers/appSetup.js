'use strict';

var { execFile }  = require('child-process-promise');
var path = require('path');

var self = {
  sane: path.join(process.cwd(), 'bin', 'sane'),

  initApp: function(args) {
    var args = args || ['new', '.', '--skip-npm', '--skip-bower', '--skip-analytics'];
    return execFile(self.sane, args);
  }
};

module.exports = self;
