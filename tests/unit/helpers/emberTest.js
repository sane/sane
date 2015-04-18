/*eslint-env node, mocha, es6 */
'use strict';

var ember = require('../../../lib/helpers/ember');
var expect = require('chai').expect;

describe('Unit: ember helper', function () {

  it('returns a value', function () {
    expect(ember).to.be.ok();
  });

  it('returns local ember by default', function () {
    expect(ember).to.match(/sane[\/\\]node_modules[\/\\]\.bin[\/\\]ember(.CMD)?$/);
  });

});
