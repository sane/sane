//var execAbort = require('../execAbort');
//var exec = require('child_process').exec;
//var sys = require('sys');

var util  = require('util');
var spawn = require('child_process').spawn;

module.exports = function up() {
  console.log('running fig up');
  // execAbort.async('fig up', false, '', '', false).then(function() {
  //   console.log('Woooohhhoooo!!!!');
  // });
  var fig = spawn('fig', ['up'], {
    // detachment and ignored stdin are the key here:
    detached: true,
    stdio: [ 'ignore', 1, 2 ]
});
  //var fig    = spawn('ls', ['-lh', '/usr']);
  fig.unref();
  // fig.stdout.on('data', function (data) {
  //   process.stdout.write('stdout: ' + data.toString());
  // });

  // fig.stderr.on('data', function (data) {
  //   process.stdout.write('stdout: ' + data.toString());
  // });

  // fig.on('exit', function (code) {
  //   console.log('child process exited with code ' + code);
  // });

  // console.log('Running fig logs');
  // figLog = spawn('fig', ['logs']);
  // //var fig    = spawn('ls', ['-lh', '/usr']);

  // figLog.stdout.on('data', function (data) {
  //   process.stdout.write('stdout: ' + data);
  // });

  // figLog.stderr.on('data', function (data) {
  //   process.stdout.write('stdout: ' + data);
  // });

  // figLog.on('exit', function (code) {
  //   console.log('child process exited with code ' + code);
  // });

  // console.log('switching to client and running ember serve')
  // cd('client');
  // execAbort.async('ember serve --proxy http://192.168.59.103:1337', false, '', '', false).then(function(){
  //   console.log('Crrraaaa');
  // });
};