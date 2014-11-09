function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function f() {
  console.log(1);
  await timeout(1000);
  console.log(6);
  await timeout(1000);
  console.log(3);
}

module.exports = function up() {
  f();
}