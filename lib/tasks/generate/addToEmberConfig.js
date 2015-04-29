
/**
 * @overview This function executes the machine that is responsible for running client tasks
 *
 * @param {String} projectRoot - path to the project root
 * @param {Object} config - contains an ENV object
 * @param {Object} config.ENV - contains other objects that will be added to the ember-cli config
 * @return {null}
 */
'use strict';

module.exports = function createEmberConfig(projectRoot, config) {
  var environmentPath = path.join(projectRoot, 'client', 'config', 'environment.js');
  var environment = fs.readFileSync(environmentPath, { encoding: 'utf8' });
  var endOfFunction = environment.indexOf('return ENV;');
  var addKeys = Object.keys(config.ENV);

  var configToAddgString = '';
  for (var i = 0, len = addKeys.length; i < len; i++) {
    configToAddgString += 'ENV[\'' + addKeys[i] + '\'] = ' + JSON.stringify(actions.addToConfig.ENV[addKeys[i]], null, 2) + ';\n\n';
  }

  var newEnvironment = environment.slice(0, endOfFunction) + configToAddgString + environment.slice(endOfFunction);

  return [environmentPath, newEnvironment];
};