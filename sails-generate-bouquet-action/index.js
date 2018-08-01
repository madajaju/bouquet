/**
 * Module dependencies
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


/**
 * sails-generate-bouquet-action
 *
 * Usage:
 * `sails generate bouquet-Action`
 *
 * @description Generates a bouquet-Action.
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
    let pathToPackageJSON = path.resolve(scope.rootPath, 'package.json');
    let package, invalidPackageJSON;
    try {
      package = require(pathToPackageJSON);
    } catch (e) {
      invalidPackageJSON = true;
    }

    if (invalidPackageJSON) {
      return done.invalid('Sorry, this command can only be used in the root directory of a Sails project.');
    }

    // scope.rootPath is the base path for this generator
    //
    // e.g. if this generator specified the target:
    // './Foobar.md': { copy: 'Foobar.md' }
    //
    // And someone ran this generator from `/Users/dbowie/sailsStuff`,
    // then `/Users/dbowie/sailsStuff/Foobar.md` would be created.
    if (!scope.rootPath) {
      return done(INVALID_SCOPE_VARIABLE('rootPath'));
    }


    // Attach defaults
    _.defaults(scope, {
      createdAt: new Date()
    });
    scope.controller = scope.args[0];
    scope.action = scope.args[1];
    scope.controller = scope.controller.replace(/\s/g, "-").toLowerCase();
    scope.action = scope.action.replace(/\s/g, "-").toLowerCase();
    scope.projectName = package.name;
    let attributes = scope.args.slice(2);

    let invalidAttributes = [];
    attributes = _.map(attributes, function (attribute, i) {

      var parts = attribute.split(':');

      if (parts[1] === undefined) parts[1] = 'string';

      // Handle invalidAttributes
      if (!parts[1] || !parts[0]) {
        invalidAttributes.push(
          'Invalid attribute notation:   "' + attribute + '"');
        return;
      }
      return {
        name: parts[0],
        type: parts[1]
      };
    });

    // Generatee Attribute section
    // Render some stringified code from the action template
    // and make it available in our scope for use later on.
    scope.attributes = this.renderTemplate('attribute-action.js', attributes);
    scope.binAttributes = this.renderTemplate('bin-attributes', attributes);
    console.log("Creating Action: " + scope.controller + "-" + scope.action);
    let bin = scope.projectName + '-' + scope.controller;
    try {
      fs.statSync(path.join(scope.rootPath, "bin/" + bin)).isFile();
    }
    catch(e) {
      this.targets['./bin/:projectName-:controller'] = {template: 'bin-command'};
    }
    return done();
  },


  /**
   * The files/folders to generate.
   * @type {Dictionary}
   */
  targets: {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // • e.g. create a folder:
    // ```
    // './hey_look_a_folder': { folder: {} }
    // ```
    //
    // • e.g. create a dynamically-named file relative to `scope.rootPath`
    // (defined by the `filename` scope variable).
    //
    // The `template` helper reads the specified template, making the
    // entire scope available to it (uses underscore/JST/ejs syntax).
    // Then the file is copied into the specified destination (on the left).
    // ```
    // './:filename': { template: 'example.template.js' },
    // ```
    //
    // • See https://sailsjs.com/docs/concepts/extending-sails/generators for more documentation.
    // (Or visit https://sailsjs.com/support and talk to a maintainer of a core or community generator.)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    './api/controllers/:controller/:action.js': {template: 'action.js'},
    './test/bin/:controller-:action.test.js': {template: 'bin.test.js'},
    './test/integration/Controller-:controller-:action.test.js': {template: 'controller.test.js'},
    './bin/:projectName-:controller-:action': {template: 'bin-action'},

  },


  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` and `copy` builtins)
   *
   * @type {String}
   */
  templatesDirectory: path.resolve(__dirname, './templates'),

  renderTemplate: function(name, parameters) {
    let ATTRIBUTE_TEMPLATE = path.resolve(__dirname, './templates/' + name);
    ATTRIBUTE_TEMPLATE = fs.readFileSync(ATTRIBUTE_TEMPLATE, 'utf8');
    var compiledTemplate = _.template(ATTRIBUTE_TEMPLATE);

    // Render some stringified code from the action template
    // and make it available in our scope for use later on.
    return _.map(parameters, function (paramter) {
      return _.unescape(
          compiledTemplate({
            name: paramter.name,
            type: paramter.type
          })
        );
    }).join('');
  }

};
