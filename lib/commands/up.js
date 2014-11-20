var spawn = require('child_process').spawn;
var chalk = require('chalk');
var EOL = require('os').EOL;

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

  for (var line, t$1$0 = regeneratorRuntime.values(outLines), t$1$1; !(t$1$1 = t$1$0.next()).done; ) {
    line = t$1$1.value;
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

    runningCmd.on('exit', function (code) {
      console.log(cmd + ' process exited with code ' + code);
    });
  }
}


module.exports = function up(options) {
  if (options.docker) {
    runAndOutput('fig', ['up'], { stdio: 'inherit', env: process.env });
  } else {
    runAndOutput('sails', ['lift'], { cwd: 'server', env: process.env });
  }
  runAndOutput('ember', ['serve', '--proxy', '127.0.0.1:1337'], { cwd: 'client', env: process.env });
}