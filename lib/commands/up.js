var spawn = require('child_process').spawn;

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

module.exports = function up() {
  // f();

  var child = spawn('ember serve --proxy 192.168.59.103', [
    'arg1', 'arg2', 'arg3' ]);
// use event hooks to provide a callback to execute when data are available:
child.stdout.on('data', function(data) {
  console.log(data.toString());
});
}