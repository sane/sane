'use strict';

/*
* filters out templates in given folderpath, taking only files with given nameBegins
* and filtering out the ones that don't match nameEnds
* Currently only taking js filesi into consideration.
*/

// var { installPackage } = require('machinepack-npm');
// var { exec }   = require('child-process-promise');
var { spawn }   = require('child-process-promise');
var dockerCompose = require('../helpers/dockerCompose');
var fs = require('fs-extra');
var path = require('path');

var self = {

  npmInstall: function(packageNames, installPath, options) {
    //default options
    options = options || {
      skip: false,
      dryRun: false,
      save: true,
      saveDev: false,
      saveExact: false,
      docker: false
      installFolder: '',
      showOutput: true
    };

    if (options.skip) {
      return new Promise(
        function(resolve, reject) {
          resolve();
      });
    }

    packageNames = packageNames || [];
    path = path || process.cwd();

    if (options.dryRun) {
      return self.dryRun(packageNames, installPath);
    }

    var mainCmd = self.getCmd(options.docker);
    var args = self.getArgs(packageNames, docker, options.installFolder, {
      save: options.save,
      saveDev: options.saveDev,
      saveExact: options.saveExact
    });
    var runOptions = self.getRunOptions();

    return spawn(mainCmd, args, runOptions);
  },

  //Note(markus): Possibly check if the dockerContainerName actually exists
  //either returns run <containerName> npm install <args> --save or
  // install <args> --save
  getArgs: function(packageNames, docker, containerName, saveOptions) {
    saveOptions = saveOptions || {};
    saveOptions['save'] = saveOptions['save'] || true;
    saveOptions['saveDev'] = saveOptions['saveDev'] || false;
    saveOptions['saveExact'] = saveOptions['saveExact'] || false;

    if (saveOptions['saveDev']) {
      saveOptions.save = false;
    }

    var baseArgs = ['install'];
    if (docker) {
      baseArgs = ['run', containerName, 'npm', 'install'];
    }

    if (saveOptions.save) {
      packageNames.push('--save');
    } else if(saveOptions.saveDev) {
      packageNames.push('--save-dev');
    }

    if (saveOptions.saveExact) {
      packageNames.push('--save-exact');
    }

    return baseArgs.concat(packageNames)
  },

  getRunOptions: function(installPath, showOutput, docker, installFolder) {
    var stdio = 'ignore';
    if (showOutput) {
      stdio = 'inherit';
    }
    if (!docker) {
      installPath = path.join(installPath, installFolder)
    }
    return { stdio: stdio, cwd: installPath };
  },

  getCmd: function(docker) {
    if (docker) {
      return dockerCompose();
    }
    return 'npm';
  },

  dryRun: function(packageNames, installPath) {
    var filename = path.join(installPath, 'package.json');
    var packageInfo = fs.readFileSync(filename);
    var content = JSON.parse(packageInfo);
    for (var i = 1, len = packageNames.length; i <= len; i++) {
      content.dependencies[packageNames[i]] = '*';
    };
    //have to return a promise
    return new Promise(
      function(resolve, reject) {
        try {
          fs.writeFileSync(filename, JSON.stringify(content, null, 2));
        } catch (err) {
          reject(err);
        }
        resolve();
    });
  }
};

module.exports = self;
