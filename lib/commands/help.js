'use strict';

var execPromise = require('child-process-promise').exec;

module.exports = async function generate(/* command */) {
  console.log('Not implemented yet.');
  console.log('cooolio');
  // spawn('echo', ['hello'], { capture: [ 'stdout', 'stderr' ]})
  //   .then(function (result) {
  //       console.log('!!!!!');
  //       console.log('[spawn] stdout: ', result.stdout.toString());
  //   })
  //   .fail(function (err) {
  //       console.error('[spawn] stderr: ', err.stderr);
  //   });

  var output = await spawnPromise('echo', ['hello'], { capture: [ 'stdout', 'stderr' ]});
  // spawnPromise('echo', ['hello'], { capture: [ 'stdout', 'stderr' ]})
  //   .then(function (result) {
  //       console.log('[spawn] stdout: ', result.stdout.toString());
  //   })
  //   .fail(function (err) {
  //     console.error(err);
  //     console.error('[spawn] stderr: ', err.stderr);
  //   });
  console.log(output.stdout.toString());

  output = await execPromise('echo hello');
  console.log(output.stdout);
};