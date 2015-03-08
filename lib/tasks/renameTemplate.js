'use strict';

/**
 * @module sane
 */

/**
 * Removes the .hbs extension from template files.
 *
 * @private
 * @method renameTemplate
 * @param {string} name Filename of the handlebars template file.
 * @return {string} Filename without .hbs extension
 */

module.exports = function renameTemplate(name) {
  return name.replace(/\.hbs$/,'');
};
