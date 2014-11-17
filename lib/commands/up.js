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
  outputMode = outputMode || 'out';
  var outLines = data.toString().split(EOL);

  for (var line, t$1$0 = regeneratorRuntime.values(outLines), t$1$1; !(t$1$1 = t$1$0.next()).done; ) {
    line = t$1$1.value;
    //dynamically console.log/.error as well as color-change
    console['outputMode'](chalk[color](prepend + ': ') + line);
  }
}

//Note(markus): When starting to use fig this might not work
//see http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
function runAndOutput(cmd, parameters, cwd) {
  var cmd = spawn(cmd, parameters, { cwd: cwd, env: process.env });

  var prepened = 'Server';
  var color = 'blue';

  if (cmd === 'ember') {
    prepened = 'Client';
    color = 'green';
  }

  // use event hooks to provide a callback to execute when data are available:
  cmd.stdout.on('data', function(data) {
    printLines(data, prepened, color);
  });

  cmd.stderr.on('data', function (data) {
    printLines(data, prepend, color, 'error');
  });

  cmd.on('exit', function (code) {
    console.log(cmd + ' process exited with code ' + code);
  });
}


module.exports = function up() {
  runAndOutput('sails', ['lift'], 'server');
  runAndOutput('ember', ['serve', '--proxy', '127.0.0.1:1337'], 'client');
}