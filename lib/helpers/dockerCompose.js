'use strict';

var which = require('which').sync;

module.exports = function () {
  try {
    which('docker-compose');
    return 'docker-compose';
  } catch (err) {
    return 'fig';
  }
};