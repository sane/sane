'use strict';

var {spawn} = require('child_process');
var chalk = require('chalk');
var {EOL} = require('os');
var exit = require('exit');
var checkEnvironment = require('../tasks/checkEnvironment');
var trackCommand = require('../tasks/trackCommand');
var getAppNames = require('../tasks/getAppNames');
var ember = require('../helpers/ember');
var sails = require('../helpers/sails');
var dockerCompose = require('../helpers/dockerCompose');

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

module.exports = async function up(options, leek) {
  var emberProxy = 'http://127.0.0.1';
  var serverPrintOptions = { prepend: serverName, color: 'blue' };
  var clientPrintOptions = { prepend: clientName, color: 'green' };

  if (!options.skipSails) {
    if (options.docker && options.docker !== 'false') {
      //TODO(markus): When 'sane up' was used and user switches to 'sane up --docker' there seem to be some issues
      // with node_modules (server starting slow or not starting at all), which can be fixed by clearing and reinstalling
      //running this on every fig up seems a bit wasteful. Try to find an automatic way that only needs to run once.
      // await spawnPromise('fig', ['run', 'server', 'rm', '-rf', 'node_modules'], { stdio: 'inherit', env: process.env });
      // await spawnPromise('fig', ['run', 'server', 'npm', 'i'], { stdio: 'inherit', env: process.env });

      if (checkEnvironment.boot2dockerExists()){
        runAndOutput('boot2docker', ['ssh', '-L' ,'1337:localhost:1337'], { env: process.env },
          { prepend: 'boot2docker', color: 'yellow', verbose: options.verbose });
      }
      if (checkEnvironment.isDockerRunning()) {
        console.log(dockerCompose());
        runAndOutput(dockerCompose(), ['up'], { stdio: 'inherit', env: process.env }, serverPrintOptions);
      } else {
        console.log('Please start docker/boot2docker and run the command again.');
        exit();
      }
    } else {
      //Note(markus):The opposite of above's TODO seems to work fine. If 'sane up --docker' is run and then sane up
      runAndOutput(sails, ['lift'], { cwd: serverName, env: process.env }, serverPrintOptions);
    }
  }

  if (!options.skipEmber) {
    runAndOutput(ember, ['serve', '--proxy', `${emberProxy}:1337`, '--live-reload', options.liveReload],
      { cwd: clientName, env: process.env }, clientPrintOptions);
  }
  if (typeof leek !== 'undefined') {
    //Only track command when processes started without issues
    trackCommand('up', options, leek);
  }
}
