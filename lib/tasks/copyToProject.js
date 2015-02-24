'use strict';

var Project = require('./Project');
var path = require('path');
var fs = require('fs-extra');
// var inquirer = require('bluebird-inquirer');
// var jsdiff = require('diff');
var chalk = require('chalk');
var { question } = require('readline-sync');

module.exports = function copyToProject(templates, projectRoot, force) {
  projectRoot = projectRoot || Project.closest().root;
  for (var template of templates.templates) {
    var sourcePath = path.join(templates.root, template);
    var destPath = path.join(projectRoot, template);
    try {
      // console.log('destPath exists', fs.existsSync(destPath));
      if (fs.existsSync(destPath) && (typeof force === 'undefined' || force === false)) {
        var err = new Error('File already exists');
        err.name = 'FileExists'
        throw err;
      }
      fs.copySync(sourcePath, destPath);
      // console.log(success);
    } catch (err) {
      // console.log('E')
      // console.log(err);
      var answer = ''
      while (['y', 'n', 'd'].indexOf(answer) === -1) {
        // console.log('no answer', answer)
        var answer = question(chalk.gray(`File conflict ${template}. Want to overwrite? (y/n/d):`) + '  (y) ') || 'y';
        // console.log('answer', answer);
        if (answer === 'y') {
          //copySync just seems to copy over the file regardless if it exists or not.
          fs.copySync(sourcePath, destPath);
        } else if (answer === 'n') {

        } else if (answer === 'd') {

        } else {
          console.log('Please choose either y for Yes, n for No or d for showing the file diff.');
        }
      }
    }
  }
};
