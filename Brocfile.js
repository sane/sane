var pickFiles = require('broccoli-static-compiler')
var compileEsnext = require('broccoli-esnext');


var app = 'esnext';
app = pickFiles(app, {
  srcDir: '/',
  destDir: '/' // move under appkit namespace
});
app = compileEsnext(app);

module.exports = app;