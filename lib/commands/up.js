var spawn = require('child_process').spawn;
// var exec = require('child-process-promise').exec;
// var spawnPromise = require('child-process-promise').spawn;
var chalk = require('chalk');
var {EOL} = require('os');
//With ES6 the same as var EOL = require('os').EOL;
var checkEnvironment = require('../tasks/checkEnvironment');
// require('es6-shim');

/*
 * @params
 *    data - Buffer Object to print
 *    prepend - string to prepend to each line of output
 *              used so user can identify which command printed that line
 *    color - which color to print (cyan, blue, green, magenta, yellow, red)
 *    outputMode - log or error
 *
 */
function printLines(data, prepend, color, outputMode) {
  color = color || 'green';
  outputMode = outputMode || 'log';
  data = data.toString();
  data = data.replace(/\r\n/g, '\n');
  data = data.replace(/\r/g, '\n');

  //a workaround, since .split adds an empty array element if the string ends with a newline
  if (data.endsWith('\n')) {
    data = data.slice(0, -1);
  }

  var outLines = data.split(/\n/);
  for (var line of outLines) {
    console[outputMode](chalk[color](prepend + '| ') + line);
  }
}

//Note(markus): When starting to use fig this might not work
//see http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
function runAndOutput(cmd, parameters, options) {
  var runningCmd = spawn(cmd, parameters, options);

  var prepend = 'server   ';
  var color = 'blue';

  if (cmd === 'ember') {
    prepend = 'client   ';
    color = 'green';
  }

  if (!options.stdio) {
    // use event hooks to provide a callback to execute when data are available:
    runningCmd.stdout.on('data', function(data) {
      printLines(data, prepend, color);
    });

    runningCmd.stderr.on('data', function (data) {
      printLines(data, prepend, color, 'error');
    });
  }

  //Doesn't do anything
  // runningCmd.on('exit', function (code) {
  //   console.log(cmd + ' process exited with code ' + code);
  // });
}

//TODO(markus): Show docker IP when using fig
//Add morgan to Sails
module.exports = async function up(options) {
  var emberProxy = '127.0.0.1';
  if (options.docker) {
    //TODO(markus): When 'sane up' was used and user switches to 'sane up --docker' there seem to be some issues
    // with node_modules (server starting slow or not starting at all), which can be fixed by clearing and reinstalling
    //running this on every fig up seems a bit wasteful. Try to find an automatic way that only needs to run once.
    // await spawnPromise('fig', ['run', 'server', 'rm', '-rf', 'node_modules'], { stdio: 'inherit', env: process.env });
    // await spawnPromise('fig', ['run', 'server', 'npm', 'i'], { stdio: 'inherit', env: process.env });
    emberProxy = checkEnvironment.getDockerIp();
    if (emberProxy.length < 7) {
      console.log('Error with your $DOCKER_HOST \'' + process.env.DOCKER_HOST + '\'. Also check if there are any issues with docker/boot2docker/fig.');
      process.exit(1);
    }
    console.log('Sails Server starting at ' + chalk.underline(`http:\/\/${checkEnvironment.getDockerIp()}:1337`) + '\n');
    runAndOutput('fig', ['up'], { stdio: 'inherit', env: process.env });
  } else {
    //Note(markus):The opposite of above's TODO seems to work fine. If 'sane up --docker' is run and then sane up
    runAndOutput('sails', ['lift'], { cwd: 'server', env: process.env });
  }
  runAndOutput('ember', ['serve', '--proxy', `${emberProxy}:1337`], { cwd: 'client', env: process.env });
}