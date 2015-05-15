'use strict';

var ember = require('../../../lib/helpers/ember');
var expect = require('chai').expect;

describe('Unit: ember helper', function () {

  it('returns a value', function () {
    expect(ember).to.be.ok; // eslint-disable-line no-unused-expressions
  });

  it('returns local ember by default', function () {
    expect(ember).to.match(/sane[\/\\]*node_modules[\/\\]*\.bin[\/\\]*ember(.cmd)?$/);
  });

});
