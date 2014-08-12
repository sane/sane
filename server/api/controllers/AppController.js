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
   */
  serve: function(req, res) {
    return res.view('index');
  }
};