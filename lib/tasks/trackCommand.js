"use strict";

/*
 *
 */

module.exports = function trackCommand(name, options, leek) {
  var optionString = "";
  for (var opt in options) {
    //exclude properties that are not cli options
    if (options.hasOwnProperty(opt) && !opt.startsWith("_") && ["commands", "options", "parent"].indexOf(opt) === -1) {
      optionString += "--" + opt + "=" + options[opt] + " ";
    }
  }

  name = "" + name + " " + optionString;

  leek.track({
    name: "sane ",
    message: name
  });
};