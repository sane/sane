/*eslint-env node, mocha, es6 */
'use strict';

var { expect }   = require('chai');
var version      = require('../../package.json').version;
var { execFile } = require('child-process-promise');
var sane         = require('../helpers/sane');

describe('Acceptance: sane help', function() {

  it('displays commands, it\'s aliases and the correct cli version', async function () {
    var output = await execFile(sane, ['help']);
    output = output.stdout;

    expect(output).to.include('new|n');
    expect(output).to.include('up|serve');
    expect(output).to.include('generate|g');
    expect(output).to.include('version: ' + version);
  });
  
});
