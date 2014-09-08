/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');

module.exports = {
  /**
   * `AppController.serve()`
   * Serves your Ember App
   *
   * Add some custom code before delivering the view if you want
   * You could us this to serve different ember apps to differen people for example
   * This can be useful for limited feature roll-out or A/B Testing
   */
  serve: function(req, res) {
    return res.view('index');
  },

  /**
   * `AppController.serveIndex()`
   * Serves your Ember App directly from the assets/index.html
   *
   * This code still needs to be tested properly, but could mean you don't need to restart
   * your server for any ember-app updates
   */
  serveIndex: function(req, res) {
    var emberApp = __dirname + '/../../assets/index.html';
    fs.exists(emberApp + '', function (exists) {
      if (!exists) {
        return res.notFound('The requested file does not exist.');
      }

      fs.createReadStream(emberApp).pipe(res);
    });
  }
};