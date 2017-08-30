/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var _ = require('lodash');


/**
 * sails-generate-bouquet-uservice
 *
 * Usage:
 * `sails generate bouquet-uservice`
 *
 * @description Generates a bouquet-uservice.
 * @docs https://sailsjs.com/docs/concepts/extending-sails/generators/custom-generators
 */

module.exports = {

  /**
   * `before()` is run before executing any of the `targets`
   * defined below.
   *
   * This is where we can validate user input, configure default
   * scope variables, get extra dependencies, and so on.
   *
   * @param  {Dictionary} scope
   * @param  {Function} done
   */

  before: function (scope, done) {
    if (!scope.args[0]) {
      return done(new Error('Please provide a name for this bouquet-SubSystem.'));
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
    if (!scope.rootPath) {
      return cb(INVALID_SCOPE_VARIABLE('rootPath'));
    }


    // Attach defaults
    _.defaults(scope, {
      createdAt: new Date()
    });

    // Decide the output filename for use in targets below:
    scope.name = scope.args[0].toLowerCase();
    scope.projectName = package.name.toLowerCase();

    return done();
  },


  /**
   * The files/folders to generate.
   * @type {Dictionary}
   */
  targets: {
    './deploy/docker-composer-dev.yaml': {template: 'docker-compose-dev.yaml'},
    './deploy/docker-composer-test.yaml': {template: 'docker-compose-test.yaml'},
    './deploy/docker-composer-prod.yaml': {template: 'docker-compose-prod.yaml'},
    './deploy/uservices/web/Dockerfile': {template: 'uservices/web/Dockerfile'},
    './deploy/uservices/web/package.json': {template: 'uservices/web/package.json'},
    './deploy/build.js': {copy: 'build.js'},
    './deploy/uservices/:name': {folder: {}},
    './deploy/uservices/:name/Dockerfile': {template: 'uservices/uservice/Dockerfile'},
    './deploy/uservices/:name/index.js': {copy: 'uservices/uservice/index.js'},
    './deploy/uservices/:name/package.json': {template: 'uservices/uservice/package.json'}
  },


  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` and `copy` builtins)
   *
   * @type {String}
   */
  templatesDirectory: path.resolve(__dirname, './templates')

};
