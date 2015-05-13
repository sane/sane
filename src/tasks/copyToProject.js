'use strict';

var Project = require('./Project');
var path = require('path');
var fs = require('fs-extra');
var jsdiff = require('diff');
var chalk = require('chalk');
var { question } = require('readline-sync');
var EOL          = require('os').EOL;

function highlightDiff(line) {
  if (line[0] === '+') {
    return chalk.green(line);
  } else if (line[0] === '-') {
    return chalk.red(line);
  } else if (line.match(/^@@/)) {
    return chalk.cyan(line);
  } else {
    return line;
  }
}

module.exports = function copyToProject(templates, projectRoot, force) {
  projectRoot = projectRoot || Project.closest().root;

  console.log('force', force);

  for (var i = 0; i < templates.templates.length; i++) {
    var task = 'overwrite';
    var template = templates.templates[i];
    var sourcePath = path.join(templates.root, template);
    var destPath = path.join(projectRoot, template);
    var templateContent;
    var destContent;
    try {

      if (fs.existsSync(destPath) && (typeof force === 'undefined' || force === false)) {
        templateContent = fs.readFileSync(sourcePath, { encoding: 'utf-8' });
        destContent = fs.readFileSync(destPath, { encoding: 'utf-8' });
        if (templateContent === destContent) {
          task = 'identical';
        } else {
          var err = new Error('File already exists');
          err.name = 'FileExists';
          throw err;
        }
      } else {
        task = 'overwrite';
      }
    } catch (err) {
      var answer = '';

      while (['y', 'n', 'd'].indexOf(answer) === -1) {
        answer = question(chalk.gray(`File ${template} already exists. Want to overwrite? (y/n/d):`) + '  (y) ') || 'y';
        if (answer === 'y') {
          // copySync just seems to copy over the file regardless if it exists or not.
          fs.copySync(sourcePath, destPath);
        } else if (answer === 'n') {
          task = 'ignore';
        } else if (answer === 'd') {
          var diff = jsdiff.createPatch(
            destPath, destContent, templateContent
          );

          var lines = diff.split('\n');

          for (var j = 0; j < lines.length; j++) {
            process.stdout.write(
              highlightDiff(lines[j] + EOL)
            );
          }
          task = 'again';
        } else {
          task = 'again';
          console.log('Please choose either y for Yes, n for No or d for showing the file diff.');
        }
      }
    } finally {
      // now decide what to do
      switch (task) {
        case 'overwrite':
          console.log(`${chalk.yellow('Overwriting')} ${template}`);
          fs.copySync(sourcePath, destPath);
          break;
        case 'identical':
          console.log(`${chalk.yellow('Identical')} ${template}`);
          break;
        case 'ignore':
          console.log(`${chalk.yellow('Ignoring')} ${template}`);
          break;
        case 'again':
          i--;
          break;
        default:
          break;
      }
    }
  }
};
