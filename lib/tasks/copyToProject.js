'use strict';

var Project = require('./Project');
var path = require('path');
var fs = require('fs-extra');
// var inquirer = require('bluebird-inquirer');
var jsdiff = require('diff');
var chalk = require('chalk');
var { question } = require('readline-sync');

module.exports = async function copyToProject(templates, projectRoot) {
  projectRoot = projectRoot || Project.closest().root;
  for (var template of templates.templates) {
    var sourcePath = path.join(templates.root, template);
    var destPath = path.join(projectRoot, template);
    try {
      // console.log(sourcePath);
      // console.log(destPath);
      // console.log('destPath exists', fs.existsSync(destPath));
      if (fs.existsSync(destPath)) {
        var err = new Error('File already exists');
        err.name = 'FileExists'
        throw err;
      }
      fs.copySync(sourcePath, destPath);
      // console.log(success);
    } catch (err) {
      // console.log('E')
      console.log(err);
      var answer = ''
      while (['y', 'n', 'd'].indexOf(answer) === -1) {
        var answer = question(chalk.gray(`File conflict ${template}. Want to overwrite? (y/n/d):`) + '  (y) ') || 'y';
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
