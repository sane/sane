'use strict';

var shell = require('shelljs');

module.exports = function () {
  if (shell.which('docker-compose')) {
    return 'docker-compose';
  } else {
    return 'fig';
  }
};
