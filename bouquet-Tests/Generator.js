/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var path = require('path');
_.defaults = require('merge-defaults');
var fs = require('fs');


/**
 * sails-generate-bouquet-tests
 *
 * Usage:
 * `sails generate bouquet-UseCase`
 *
 * @description Generates a bouquet-UseCase
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
    // $ sails generate bouquet-UseCase user find create update
    // then `scope.args` would be `['user', 'find', 'create', 'update']`
    var pathToPackageJSON = path.resolve(scope.rootPath, 'package.json');
    var package, invalidPackageJSON;
    try {
      package = require(pathToPackageJSON);
    } catch (e) {
      invalidPackageJSON = true;
    }

    /*if (!scope.args[0]) {
      return cb(new Error('Please provide a name for this bouquet-UseCase.'));
    }
    */

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
    const useCasesDir = scope.rootPath + "/design/UseCases";
    const actorsDir = scope.rootPath + "/design/Actors";
    const solutionDir = scope.rootPath + "/design/Solution";
    this.targets = {'./test/UseCases': {folder: {force: true}}};

    var useCases = getUseCases(this.useCaseTargets, useCasesDir);
    var actors = getActors(this.actorTargets,actorsDir);
    var subSystems = getSubSystems(this.subsystemTargets, solutionDir);

    console.log(useCases);
    console.log("Actors:", actors);

    // Attach defaults
    _.defaults(scope, {
      createdAt: new Date()
    });

    // Decide the output filename for use in targets below:
    scope.name = scope.args[0];
    scope.readme = "UseCase-" + scope.args[0] + ".md";
    scope.systemName = package.name;
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
  useCaseTargets: {
    './test/UseCases/:testName.test.js': {template: 'usecase.test.js'},
  },
  actorTargets: {
    './test/Actors/:actor.test.js': {template: 'actor.test.js'},
  },
  subsystemTargets: {
    './test/SubSystem/:name.test.js': {template: 'subsystem.test.js'},
  },
  targets: {

    // Usage:
    // './path/to/destination.foo': { someHelper: opts }

    // Creates a dynamically-named file relative to `scope.rootPath`
    // (defined by the `filename` scope variable).
    //
    // The `template` helper reads the specified template, making the
    // entire scope available to it (uses underscore/JST/ejs syntax).
    // Then the file is copied into the specified destination (on the left).
    // './test/UseCases/:testName': {template: 'usecase.test.js'},
    // './design/UseCases/:name/Activities.puml': {template: 'Activities.puml'},
    // './design/UseCases/:name/:readme': {template: 'README.md'},

    // Creates a folder at a static path
    './test/UseCases': {folder: {force: true}},
    './test/Actors': {folder: {force: true}},
    './test/SubSystems': {folder: {force: true}},
    //'./design/UseCases/:name': {folder: {force: true}}

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
    'Issue encountered in generator "bouquet-UseCase":\n' +
    'Missing required scope variable: `%s`"\n' +
    'If you are the author of `sails-generate-bouquet-tests`, please resolve this ' +
    'issue and publish a new patch release.';

  message = (message || DEFAULT_MESSAGE) + (details ? '\n' + details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}

function getActors(targets, folder) {
  var retval = {};
  var actors = fs.readdirSync(folder)
    .filter(function (subfolder) {
      return fs.statSync(path.join(folder, subfolder)).isDirectory();
    }).forEach(function(actor) {
      return Object.keys(targets).forEach(function(dest) {
        var entry = targets[dest];
        dest.replace(":actor", actor);
        retval[dest] = entry;
      });
    });
  console.log("RetVal:", retval);
  return retval;
}

function getUseCases(targets, folder) {
  var retval = [];
  var usecases = fs.readdirSync(folder)
    .filter(function (subfolder) {
      return fs.statSync(path.join(folder,subfolder)).isDirectory();
    })
    /*.filter(function (subfoloder) {
      subfolder !== 'node_modules' && subfolder[0] !== '.'
    }) */

  usecases.forEach(function (usecase) {
    var scenarios = fs.readdirSync(path.join(folder,usecase))
      .filter(function(file) {
        return file.match(/^Scenario\-/);
      })
      .map(function(file) {
        return file.replace("Scenario-","").replace(".md", "");
      });
    retval.push({name:usecase, scenarios:scenarios});
  });
  return retval;
}

function getSubSystems(folder) {
  console.log("Made It");
}
