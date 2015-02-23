var path = require('path');

module.exports.autoreload = {
  active: process.env.NODE_ENV === undefined || process.env.NODE_ENV ==='development',
  //use polling to watch file changes
  //slower but needed for the docker image
  usePolling: {{ pollingWatch }},
  // Set dirs to watch
  dirs: [
    path.resolve('api','blueprints'),
    path.resolve('api','controllers'),
    path.resolve('api','models'),
    path.resolve('api','policies'),
    path.resolve('api','responses'),
    path.resolve('api','services'),
    path.resolve('config')
  ]
};
