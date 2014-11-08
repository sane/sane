function timeout(ms) {
  return new Promise(function(res) {
    return setTimeout(res, ms);
  });
}

function f() {
  return regeneratorRuntime.async(function f$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      console.log(1);
      context$1$0.next = 3;
      return timeout(1000);
    case 3:
      console.log(2);
      context$1$0.next = 6;
      return timeout(1000);
    case 6:
      console.log(3);
    case 7:
    case "end":
      return context$1$0.stop();
    }
  }, null, this);
}

module.exports = function up() {
  f();
}