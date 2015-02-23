'use strict';

var path       = require('path');

var { expect } = require('chai');
var { execFile } = require('child-process-promise');
var { sane } = require('../helpers/acceptanceSetup');

var version = require('../../package.json').version;




describe('Acceptance: sane help', function() {
  it('displays commands, it\'s aliases and the correct cli version', async function() {
    var output = await execFile(sane, ['help']);
    output = output.stdout;

    expect(output).to.include('new|n');
    expect(output).to.include('up|serve');
    expect(output).to.include('generate|g');
    expect(output).to.include('version: ' + version);
  });
});
