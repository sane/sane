'use strict';

var {spawn} = require('child_process');
// var exec = require('child-process-promise').exec;
// var spawnPromise = require('child-process-promise').spawn;
var chalk = require('chalk');
var {EOL} = require('os');
//With ES6 the same as var EOL = require('os').EOL;
var checkEnvironment = require('../tasks/checkEnvironment');
var trackCommand = require('../tasks/trackCommand');
var getAppNames = require('../tasks/getAppNames');

var serverName = getAppNames.server();
var clientName = getAppNames.client();
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
function runAndOutput(cmd, parameters, execOptions, printOptions) {
  var runningCmd = spawn(cmd, parameters, execOptions);

  if (printOptions.verbose === undefined) {
    printOptions.verbose = true;
  }

  if (!execOptions.stdio && printOptions.verbose) {
    var prepend = `${printOptions.prepend}`;
    if (printOptions.prepend.length === 6) {
      prepend += '   ';
    }
    var color = printOptions.color;

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
module.exports = async function up(options, leek) {
  var emberProxy = '127.0.0.1';
  trackCommand('up', options, leek);
  var serverPrintOptions = { prepend: serverName, color: 'blue' };
  var clientPrintOptions = { prepend: clientName, color: 'green' };

  if (options.docker) {
    //TODO(markus): When 'sane up' was used and user switches to 'sane up --docker' there seem to be some issues
    // with node_modules (server starting slow or not starting at all), which can be fixed by clearing and reinstalling
    //running this on every fig up seems a bit wasteful. Try to find an automatic way that only needs to run once.
    // await spawnPromise('fig', ['run', 'server', 'rm', '-rf', 'node_modules'], { stdio: 'inherit', env: process.env });
    // await spawnPromise('fig', ['run', 'server', 'npm', 'i'], { stdio: 'inherit', env: process.env });

    //Note(markus): With port-forwarding we don't need to get the IP address from the DOCKER_HOST variable
    // Not tested on linux, but it should just work as long as docker is set to localhost.
    // emberProxy = checkEnvironment.getDockerIp();
    // if (emberProxy.length < 7) {
    //   console.log('Error with your $DOCKER_HOST environment variable, make sure it is set: \'' + process.env.DOCKER_HOST + '\'.');
    //   console.log('Also check if there are any other issues with docker/boot2docker/fig.');
    //   process.exit(1);
    // }
    // console.log('Sails Server starting at ' + chalk.underline(`http:\/\/${checkEnvironment.getDockerIp()}:1337`) + '\n');

    if (checkEnvironment.boot2dockerExists()){
      runAndOutput('boot2docker', ['ssh', '-L' ,'1337:localhost:1337'], { env: process.env },
        { prepend: 'boot2docker', color: 'yellow', verbose: options.verbose });
    }

    runAndOutput('fig', ['up'], { stdio: 'inherit', env: process.env }, serverPrintOptions);
  } else {
    //Note(markus):The opposite of above's TODO seems to work fine. If 'sane up --docker' is run and then sane up
    runAndOutput('sails', ['lift'], { cwd: serverName, env: process.env }, serverPrintOptions);
  }

  runAndOutput('ember', ['serve', '--proxy', `${emberProxy}:1337`, '--live-reload', options.liveReload],
    { cwd: clientName, env: process.env }, clientPrintOptions);
}