'use strict';

var Leek = require('leek');

module.exports = function setUpTracking(trackingCode, name, version, config) {
  function clientId() {
    var ConfigStore = require('configstore');
    var configStore = new ConfigStore('sane-cli');
    var id = configStore.get('client-id');
    if (id) {
      return id;
    } else {
      id = require('node-uuid').v4().toString();
      configStore.set('client-id', id);
      return id;
    }
  }

  //setup analytics
  var leekOptions = {
    trackingCode: trackingCode,
    globalName: name,
    name: clientId(),
    version: version,
    silent: config.disableAnalytics || false
  };

  return new Leek(leekOptions);
};