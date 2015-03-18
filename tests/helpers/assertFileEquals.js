'use strict';

var expect = require('chai').expect;
var fs     = require('fs');


/*
  Assert that a given file matches another.
  @method assertFileEqual
  @param {String} pathToActual
  @param {String} pathToExpected
*/
module.exports = function assertFileEquals(pathToActual, pathToExpected) {
  // Strip leading and trailing whitespace from files
  // to avoid problems with some OS adding newlines at end of files
  var actual = fs.readFileSync(pathToActual, { encoding: 'utf-8' }).toString().replace(/^(\s*)((\S+\s*?)*)(\s*)$/, '$2');
  var expected = fs.readFileSync(pathToExpected, { encoding: 'utf-8' }).toString().replace(/^(\s*)((\S+\s*?)*)(\s*)$/, '$2');
  expect(actual).to.equal(expected);
};
