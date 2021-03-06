/**
 * Module dependencies
 */
var util = require('util');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

_.defaults = require('merge-defaults');


/**
 * sails-generate-bouquet
 *
 * Usage:
 * `sails generate bouquet`
 *
 * @description Generates a bouquet
 * @help See http://links.sailsjs.org/docs/generators
 */

module.exports = {

  /**
   * `before()` is run before executing any of the `targets`
   * defined below.
   *
   * This is where we can validate user input, configure default
   * scope variables, get extra dependencies, and so on.
   *
   * @param  {Object} scope
   * @param  {Function} cb    [callback]
   */

  before: function (scope, cb) {

    // scope.args are the raw command line arguments.
    //
    // e.g. if someone runs:
    // $ sails generate bouquet user find create update
    // then `scope.args` would be `['user', 'find', 'create', 'update']`
    // Make sure we're in the root of a Sails project.
    let pathToPackageJSON = path.resolve(scope.rootPath, 'package.json');
    let package, invalidPackageJSON;
    try {
      package = require(pathToPackageJSON);
    }
    catch (e) {
      return cb.invalid('Sorry, This must be run in the project root');
    }

    let pathToNewPackageJSON = path.resolve(__dirname, './templates/package.json');
    console.log(pathToNewPackageJSON);
    let newPackage;
    try {
      newPackage = require(pathToNewPackageJSON);
    }
    catch (e) {
      console.error("Error:", e);
      return cb.invalid('Sorry, cannot find the new package.json file');
    }

    // Merge the two packages.
    for(let item in newPackage) {
      for(let item2 in newPackage[item]) {
        if (package[item].hasOwnProperty(item2)) {
          package[item][item2] = newPackage[item][item2];
        }
        else {
          package[item][item2] = newPackage[item][item2];
        }
      }
    }
    console.log(package);

    // scope.rootPath is the base path for this generator
    //
    // e.g. if this generator specified the target:
    // './Foobar.md': { copy: 'Foobar.md' }
    //
    // And someone ran this generator from `/Users/dbowie/sailsStuff`,
    // then `/Users/dbowie/sailsStuff/Foobar.md` would be created.
    if (!scope.rootPath) {
      return cb(INVALID_SCOPE_VARIABLE('rootPath'));
    }


    // Attach defaults
    _.defaults(scope, {
      createdAt: new Date()
    });

    // Decide the output filename for use in targets below:

    scope.name = package.name;
    scope.projectName = package.name;
    // Add other stuff to the scope for use in our templates:

    // When finished, we trigger a callback with no error
    // to begin generating files/folders as specified by
    // the `targets` below.
    cb();
  },


  /**
   * The files/folders to generate.
   * @type {Object}
   */

  targets: {

    // Usage:
    // './path/to/destination.foo': { someHelper: opts }

    // Creates a dynamically-named file relative to `scope.rootPath`
    // (defined by the `filename` scope variable).
    //
    // The `template` helper reads the specified template, making the
    // entire scope available to it (uses underscore/JST/ejs syntax).
    // Then the file is copied into the specified destination (on the left).
    // './:filename': { template: 'example.template.js' },

    // Creates a folder at a static path
    './bin/:name': {template: 'bin/systemName'},
    './Jenkinsfile': {template: 'Jenkinsfile'},
    './docs/conf.py': {template: 'docs/conf.py'},
    './docs/plantuml.jar': {copy: 'docs/plantuml.jar'},
    './package.json.new': {template: 'package.json'},
    './deploy/build-doc.js': {copy: 'build-doc.js'},
    './docs/Home.rst': {template: 'docs/Home.rst'},
    './docs/index.rst': {template: 'docs/index.rst'},
    './docs/Architecture.puml': {template: 'docs/Logical.puml'},
    './docs/Solution/Solution.rst': {template: 'docs/Solution/Solution.rst'},
    './docs/Solution/index.rst': {template: 'docs/Solution/index.rst'},
    './docs/Solution/Deployment.puml': {template: 'docs/Solution/Deployment.puml'},
    './docs/Solution/Logical.puml': {template: 'docs/Solution/Logical.puml'},
    './docs/Solution/Physical.puml': {template: 'docs/Solution/Physical.puml'},
    './docs/Solution/Process.puml': {template: 'docs/Solution/Process.puml'},
    './docs/UseCases/index.rst': {template: 'docs/UseCases/index.rst'},
    './docs/UseCases/UseCases.puml': {template: 'docs/UseCases/UseCases.puml'},
    './docs/Actors/index.rst': {template: 'docs/Actors/index.rst'}
  },


  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` helper)
   *
   * @type {String}
   */
  templatesDirectory: require('path').resolve(__dirname, './templates')
};


/**
 * INVALID_SCOPE_VARIABLE()
 *
 * Helper method to put together a nice error about a missing or invalid
 * scope variable. We should always validate any required scope variables
 * to avoid inadvertently smashing someone's filesystem.
 *
 * @param {String} varname [the name of the missing/invalid scope variable]
 * @param {String} details [optional - additional details to display on the console]
 * @param {String} message [optional - override for the default message]
 * @return {Error}
 * @api private
 */

function INVALID_SCOPE_VARIABLE(varname, details, message) {
  var DEFAULT_MESSAGE =
    'Issue encountered in generator "bouquet":\n' +
    'Missing required scope variable: `%s`"\n' +
    'If you are the author of `sails-generate-bouquet`, please resolve this ' +
    'issue and publish a new patch release.';

  message = (message || DEFAULT_MESSAGE) + (details ? '\n' + details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}
