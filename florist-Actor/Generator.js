/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

_.defaults = require('merge-defaults');


/**
 * sails-generate-florist-actor
 *
 * Usage:
 * `sails generate florist-Actor`
 *
 * @description Generates a florist-Actor
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
    // $ sails generate florist-Actor user find create update
    // then `scope.args` would be `['user', 'find', 'create', 'update']`
    if (!scope.args[0] && !scope.args[1]) {
      return cb(new Error('Please provide args for florist-Actor <Name> <nickname>.'));
    }
    // Make sure we're in the root of a Sails project.
    var pathToPackageJSON = path.resolve(scope.rootPath, 'package.json');
    var package, invalidPackageJSON;
    try {
      package = require(pathToPackageJSON);
    } catch (e) {
      invalidPackageJSON = true;
    }

    if (invalidPackageJSON) {
      return cb.invalid('Sorry, this command can only be used in the root directory of a Sails project.');
    }

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
    scope.projectName = package.name
    scope.name = scope.args[0];
    scope.nickname = scope.args[1];
    scope.testName = scope.args[0] + ".test.js";

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
    './design': {folder: {}},
    './design': {folder: {}},
    './design/Actors': {folder: {}},
    './design/Actors/:name': {folder: {}},
    './design/Actors/:name/Activity.puml': {template: 'Activity.puml'},
    './design/Actors/:name/README.md': {template: 'README.md'},
    './design/Actors/:name/UseCases.puml': {template: 'UseCases.puml'},
    './design/Actors/:name/Workflow.puml': {template: 'Workflow.puml'},
    './test/Actors': {folder: {}},
    './test/Actors/:testName': {template: 'actor.test.js'},
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
    'Issue encountered in generator "florist-Actor":\n' +
    'Missing required scope variable: `%s`"\n' +
    'If you are the author of `sails-generate-florist-actor`, please resolve this ' +
    'issue and publish a new patch release.';

  message = (message || DEFAULT_MESSAGE) + (details ? '\n' + details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}
