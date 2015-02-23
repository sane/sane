'use strict';

require('shelljs/global');

module.exports = function() {
  if(which('docker-compose')) {
    return 'docker-compose';
  } else {
    return 'fig';
  }
}
