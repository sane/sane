'use strict'

var program = require('commander');
var Yam = require('yam');
var packageConfig = require('../package.json');
var chalk = require('chalk');

var version = packageConfig.version;
var name = packageConfig.name;
var trackingCode = packageConfig.trackingCode;

var commands = require('./commands');
var setUpTracking = require('./helpers/setUpTracking');


//TODO(markus): Wrap everything into a promise, so you can call cli(args).then() or await cli(arg)
module.exports = function cli(args) {
  //load config/default parameters from .sane-cli file in current and home directory
  var config = new Yam('sane-cli').getAll();

  //support the undocumented flag --skip-analytics, really just for testing.
  var i = args.indexOf('--skip-analytics');
  var skipAnalytics = [];
  if(i != -1) {
    skipAnalytics = args.splice(i, 1);
  }
  var leek;
  if (skipAnalytics.length === 0) {
    var leek = setUpTracking(trackingCode, name, version, config);
  }


  program
  .version(version)
  .usage('<command>');

  // TODO: help command - should work as an alias to --help but also show help for subcommands
  // program
  //   .command('help [command]')
  //   .alias('h')
  //   .description('Shows the help, optionally for a single command')
  //   .action(function(command){ commands.help(command) });

  //new command
  program
  .command('new <name>')
  .alias('n')
  .description('Creates a new sane project. Choose database via -d disk(default)|mongo|mysql|postgres')
  .option('-d, --database [type]', 'Options: disk (default), mongo, mysql, postgres, redis', config.database || 'disk')
  .option('-D, --docker [boolean]', 'Setup Sails server and dependencies within docker containers.', config.docker || false)
  .option('-v, --verbose [boolean]', 'Show more detailed command output.', config.verbose || false)
  .option('--skip-npm [boolean]', 'Skips npm installation for ember-cli project creation', config.skipNpm || false)
  .option('--skip-bower [boolean]', 'Skips bower installation for ember-cli project creation', config.skipBower || false)
  .action(function(name, options) {
    commands.new(name, options, leek).catch(function(error) {
      console.log(chalk.red(error.message));
    });
  });

  // TODO: up command - need to look into, how to unify logs.
  // Other than that it is just a simple substitue for 'fig up && cd client && ember server --proxy http://192.168.59.103:1337'
  program
  .command('up')
  .option('-D, --docker [boolean]', 'Run Sails server and dependencies within docker containers.', config.docker || false)
  .option('-l, --live-reload [boolean]', 'Controls the live-reload functionality for ember-cli', true)
  .option('-v, --verbose [boolean]', 'Show more detailed command output.', config.verbose || false)
  .option('-e, --skip-ember [boolean]', 'Do not lift the ember server.', config.skipEmber || false)
  .option('-s, --skip-sails [boolean]', 'Do not lift the sails (and database) server.', config.skipSails || false)
    // .option('-v, --verbose', 'Show more detailed command output.')
    .alias('serve')
    .description('Starts the Sails and Ember server with a unified log.')
    .action(function(options) {
      commands.up(options, leek);
    });

  //TODO: generate command - should simply call:
  // fig run server sails generate model <name> [options...]
  // fig run server sails generate controller <name>
  // cd client && ember g resource <name> [options]
  program
  .command('generate <blueprint> [name] [attributes...]')
  .option('-D, --docker [boolean]', 'Run Sails server and dependencies within docker containers.', config.docker || false)
  .option('--pod [boolean]', 'Places newly generated resource in an Ember pod', config.pod || false)
  .alias('g')
  .description('Generates new code for client and server from blueprints')
  .action(function(blueprint, name, attributes, options){
    commands.generate(blueprint, name, attributes, options, leek);
  });

  //TODO: sync command: Farily complex. Needs to check which models exist on the client-side, which on the server-side
  // and then create all the one that don't exist on either side and the rest make sure they are the same.
  // For all attributes that only exist on the sails side (e.g. email) a substitute has to be found
  // Think if it makes sense to have some minimal settings (flags, or .sanerc file?) to ignore certain models/attrinutes
  //   .command('sync [modelName]')
  //   .alias('s')
  //   .description('Syncs the client and server models.')
  //   .action(function(modelName){ commands.sync(modelName); });

  program.on('--help', function(){
    console.log('version: ' + version);
  });

  program.parse(args);

  if(!program.args.length || program.args[0] === 'help') {
    program.help();
  }
}