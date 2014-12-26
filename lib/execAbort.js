'use strict';

//Executes the command. Exits with errorMessage on failed execution
require('shelljs/global');
//var PleasantProgress = require('pleasant-progress');
var chalk = require('chalk');

module.exports = {
  sync: function(cmd, errorMessage, silent) {
    errorMessage = errorMessage || 'Error: command ' + cmd + ' failed.';
    if (silent === undefined) {
      silent = true;
    }
    var execCmd = exec(cmd, { silent: silent });
    if (execCmd.code !== 0) {
      console.log(errorMessage);
      //Note: Implement --force flag.
      //echo('Exiting. If you want to ignore that error provide the --force flag.');
      console.log('Please report this error to https://github.com/artificialio/sane/issues.');
      console.log(chalk.yellow('\nFurther output from the run command:'));
      console.log(execCmd.output);
      exit(1);
    }
  } //,
  // async: function (cmd, silent, errorMessage, buildMessage, successMessage) {
  //   errorMessage = errorMessage || 'Error: command ' + cmd + ' failed.';
  //   if (silent === undefined) {
  //     silent = true;
  //   }

  //   if (buildMessage === undefined) {
  //     var progress = null;
  //   } else {
  //     var progress = new PleasantProgress();
  //     progress.start(chalk.green(buildMessage));
  //   }

  //   return new Promise(function(resolve, reject){
  //     exec(cmd, { silent: silent, async: true }, function(code, output){
  //       if (progress) {
  //         progress.stop();
  //         console.log(chalk.green(successMessage));
  //       }
  //       if (code !== 0) {
  //         console.log(errorMessage);
  //         //Note: Implement --force flag.
  //         //echo('Exiting. If you want to ignore that error provide the --force flag.');
  //         console.log('Please report this error to https://github.com/artificialio/sane/issues.');
  //         console.log(chalk.yellow('\nFurther output from the run command:'));
  //         console.log(output);
  //         //reject('reject');
  //         exit(1);
  //       }
  //       resolve();
  //     })
  //   });
  // }
};