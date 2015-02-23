'use strict';
var verbose = require('verboser');
var assign  = require('lodash/object/assign');

/**
  The Project model is tied to your package.json. It is instiantiated
  by giving Project.closest the path to your project.
  @class Project
  @constructor
  @param {String} root Root directory for the project
  @param {Object} pkg  Contents of package.json
*/
function Project(root, pkg) {
  verbose.log('init root: %s', root);
  this.root          = root;
  this.pkg           = pkg;
  this.addonPackages = {};
}

Project.prototype.dependencies = function(pkg, excludeDevDeps) {
  pkg = pkg || this.pkg || require('package.json') || {};

  var devDependencies = pkg['devDependencies'];
  if (excludeDevDeps) {
    devDependencies = {};
  }

  return assign({}, devDependencies, pkg['dependencies']);
};

/**
  Returns a new project based on the first package.json that is found
  in `pathName`.

  @private
  @static
  @method closest
  @param  {String} pathName Path to your project
  @return {Promise}         Promise which resolves to a {Project}
 */
Project.closest = function(pathName) {
  pathName = pathName || process.cwd();
  return closestPackageJSON(pathName)
    .then(function(result) {
      verbose.log('closest %s -> %s', pathName, result);
      if (result.pkg && result.pkg.name === 'ember-cli') {
        return NULL_PROJECT;
      }

      return new Project(result.directory, result.pkg);
    })
    .catch(function(reason) {
      handleFindupError(pathName, reason);
    });
};

Project.prototype.discoverAddons = function(root, pkg, excludeDevDeps) {
  Object.keys(this.dependencies(pkg, excludeDevDeps)).forEach(function(name) {
    if (name !== 'sane-cli') {
      var addonPath = path.join(root, 'node_modules', name);
      this.addIfAddon(addonPath);
    }
  }, this);

  if (pkg['ember-addon'] && pkg['ember-addon'].paths) {
    pkg['ember-addon'].paths.forEach(function(addonPath) {
      addonPath = path.join(root, addonPath);
      this.addIfAddon(addonPath);
    }, this);
  }
};

AddonDiscovery.prototype.addIfAddon = function(addonPath) {
  var pkgPath = path.join(addonPath, 'package.json');
  verbose.log('attemping to add: %s',  addonPath);

  if (fs.existsSync(pkgPath)) {
    var addonPkg = require(pkgPath);
    var keywords = addonPkg.keywords || [];
    verbose.log(' - module found: %s', addonPkg.name);

    addonPkg['ember-addon'] = addonPkg['ember-addon'] || {};

    if (keywords.indexOf('ember-addon') > -1) {
      verbose.log(' - is addon, adding...');
      var addonInfo = {
        name: addonPkg.name,
        path: addonPath,
        pkg: addonPkg,
      };
      return addonInfo;
    } else {
      verbose.log(' - no ember-addon keyword, not including.');
    }
  } else {
    verbose.log(' - no package.json (looked at ' + pkgPath + ').');
  }

  return null;
};

module.exports = Project;

// function getIfAddon(folderPath) {
//   var pkgPath = path.join(addonPath, 'package.json');
//   verbose.log('attemping to add: %s',  addonPath);
//
//   if (fs.existsSync(pkgPath)) {
//     var addonPkg = require(pkgPath);
//     var keywords = addonPkg.keywords || [];
//     verbose.log(' - module found: %s', addonPkg.name);
//
//     addonPkg['ember-addon'] = addonPkg['ember-addon'] || {};
//
//     if (keywords.indexOf('ember-addon') > -1) {
//       verbose.log(' - is addon, adding...');
//       this.discoverAddons(addonPath, addonPkg, true);
//       this.addonPackages[addonPkg.name] = {
//         path: addonPath,
//         pkg: addonPkg
//       };
//     } else {
//       verbose.log(' - no ember-addon keyword, not including.');
//     }
//   }
// }
// Project.prototype.addonBlueprintLookupPaths = function() {
//   var addonPaths = this.addons.map(function(addon) {
//     if (addon.blueprintsPath) {
//       return addon.blueprintsPath();
//     }
//   }, this);
//
//   return addonPaths.filter(Boolean).reverse();
// };
//
//
//
// Project.prototype.dependencies = function(pkg, excludeDevDeps) {
//   pkg = pkg || this.pkg || require('package.json') || {};
//
//   var devDependencies = pkg['devDependencies'];
//   if (excludeDevDeps) {
//     devDependencies = {};
//   }
//
//   return assign({}, devDependencies, pkg['dependencies']);
// };
