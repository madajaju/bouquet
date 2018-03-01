/**
 * Module dependencies
 */

var fs = require('fs');
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
      return done(new Error('Please provide a name for this bouquet-uservice.'));
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
    scope.name = scope.name.replace(/\s/g, "-");
    scope.projectName = package.name.toLowerCase();

    /*************************************************************************
     * Now decide which targets are going to be used if this is the first time
     * this is being run or not.
     * Check if the deploy/web exits if it does then just generate the uservice
     * Otherwise generate the framework and the uservice.
     */
    try {
      if (fs.statSync(path.join(scope.rootPath, "deploy/uservices/web")).isDirectory()) {
        this.targets = {
          './deploy/uservices/:name': {folder: {}},
          './deploy/uservices/:name/Dockerfile': {template: 'uservices/uservice/Dockerfile'},
          './deploy/uservices/:name/index.js': {copy: 'uservices/uservice/index.js'},
          './deploy/uservices/:name/package.json': {template: 'uservices/uservice/package.json'}
        };
      }
    }
    catch (error) {
      if (error) {
        this.targets = {
          './deploy/dev/docker-compose.yaml': {template: 'docker-compose-dev.yaml'},
          './deploy/test/docker-compose.yaml': {template: 'docker-compose-test.yaml'},
          './deploy/production/docker-compose.yaml': {template: 'docker-compose-prod.yaml'},
          './deploy/build/docker-compose.yaml': {template: 'docker-compose-dev.yaml'},
          './deploy/uservices/web/Dockerfile': {template: 'uservices/web/Dockerfile'},
          './deploy/uservices/web/package.json': {template: 'uservices/web/package.json'},
          './deploy/build.js': {copy: 'build.js'},
          './deploy/uservices/:name': {folder: {}},
          './deploy/uservices/:name/Dockerfile': {template: 'uservices/uservice/Dockerfile'},
          './deploy/uservices/:name/index.js': {copy: 'uservices/uservice/index.js'},
          './deploy/uservices/:name/package.json': {template: 'uservices/uservice/package.json'}
        };
      }
    }
    return done();
  },

  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` and `copy` builtins)
   *
   * @type {String}
   */
  templatesDirectory: path.resolve(__dirname, './templates')

};
