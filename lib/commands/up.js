var spawn = require('child_process').spawn;
var chalk = require('chalk');
var EOL = require('os').EOL;

// function timeout(ms) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// async function f() {
//   console.log(1);
//   await timeout(1000);
//   console.log(6);
//   await timeout(1000);
//   console.log(3);
// }

function printLines(data, prepend, isError) {
  isError = isError || false;
  var outLines = data.toString().split(EOL);

  for (var line, t$1$0 = regeneratorRuntime.values(outLines), t$1$1; !(t$1$1 = t$1$0.next()).done; ) {
    line = t$1$1.value;
    if (isError) {
      if (prepend === 'Client') {
        console.error(chalk.green(prepend + ': ') + line);
      } else {
        console.error(chalk.blue(prepend + ': ') + line);
      }
    } else {
      if (prepend === 'Client') {
        console.log(chalk.green(prepend + ': ') + line);
      } else {
        console.log(chalk.blue(prepend + ': ') + line);
      }
    }
  }
}



module.exports = function up() {
  var sails = spawn('sails', ['lift', '--proxy 192.168.59.103'], { cwd: 'server', env: process.env });
  // use event hooks to provide a callback to execute when data are available:
  sails.stdout.on('data', function(data) {
    printLines(data, 'Server');
  });

  sails.stderr.on('data', function (data) {
    printLines(data, 'Server', true);
  });

  sails.on('exit', function (code) {
    console.log('Server process exited with code ' + code);
  });

  //'--proxy 192.168.59.103:1337'
  var ember = spawn('ember', ['serve', '--proxy 127.0.0.1:1337'], { cwd: 'client', env: process.env });
  // use event hooks to provide a callback to execute when data are available:
  ember.stdout.on('data', function(data) {
    printLines(data, 'Client');
  });

  ember.stderr.on('data', function (data) {
    printLines(data, 'Client', true);
  });

  ember.on('exit', function (code) {
    console.log('Client process exited with code ' + code);
  });
}