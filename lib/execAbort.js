//Executes the command. Exits with errorMessage on failed execution
require('shelljs/global');

module.exports = function execAbort(cmd, errorMessage) {
  errorMessage = errorMessage || 'Error: command ' + cmd + ' failed.';
  if (exec(cmd).code !== 0) {
    console.log(errorMessage);
    //Note: Implement --force flag.
    //echo('Exiting. If you want to ignore that error provide the --force flag.');
    console.log('Please report this error to https://github.com/artificialio/sane/issues.');
    exit(1);
  }
};