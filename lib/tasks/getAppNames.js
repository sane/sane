'use strict';

/*
 * IMPORTANT: Right now only one client and server are supported.
 *
 * Checks the .sane-cli files for registered server and client apps.
 * Which is then uesd for logging and to identify the folder names
 *
 * Conventions used:
 * Clients either start with client then the full name is taken for logging and the foldername,
 * or they end with -client and then that is truncated and merely serves identification
 *
 * Servers follow the same convention, just starting with server or ending with -server
 *
 * Examples:
 * 'client' => Expected folder-name: client
 * 'clientv1' => Expected folder-name: clientv1
 * 'admin-v1-client' => Expected folder-name: admin-v1
 * 'server' => Expected folder-name: server
 * 'server2' => Expected folder-name: server2
 * 'api-v1-server' => Expected folder-name: api-v1
 */
var Yam = require('yam');
var apps = new Yam('sane-cli').get('apps');

var self = {
  client: function() {
    var client = self.getApp('client');
    return client;
  },
  //only use this function for windows and mac
  server: function() {
    var server = self.getApp('server');
    return server;
  },
  getApp: function(filter) {
    if (apps === undefined) {
      return filter;
    }

    var filteredApps = apps.filter(app => app.startsWith(filter) || app.endsWith(filter));
    // var filteredApps = apps.filter(app => app.beginsWith(filter) || app.endsWith(filter));
    if (filteredApps[0].length > (filter.length + 1) && filteredApps[0].endsWith(filter)) {
      //slice off -client or -server at the end
      filteredApps[0] = filteredApps[0].slice(0, -(filter.length + 1));
    }
    return filteredApps[0];
  }
};

module.exports = self;