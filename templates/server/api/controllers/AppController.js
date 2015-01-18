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
   * Serves your Ember App directly from the assets/index.html
   *
   * Add some custom code before delivering the app if you want
   * You could add some analytics, or use this to serve different
   * ember apps to differen people.
   * That can be useful for limited feature roll-out or A/B Testing, etc.
   *
   */
  serve: function(req, res) {
    var emberApp = __dirname + '/../../assets/index.html';
    fs.exists(emberApp, function (exists) {
      if (!exists) {
        return res.notFound('The requested file does not exist.');
      }

      fs.createReadStream(emberApp).pipe(res);
    });
  }
};
