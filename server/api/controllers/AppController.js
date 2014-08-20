/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = fs = require('fs');

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
  }
};