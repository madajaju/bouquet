var request = require('supertest');
var exec = require('child_process').exec;

describe('<%- controller %> <%- action %> Test Cases', function () {
  describe('Primary <%- controller %> <%- action %> Test Case', function () {
    it('Primary <%- controller %> <%- action %> Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
        var command = exec("./bin/<%- projectName %>-<%- controller %>-<%- action %>", function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      command.on('exit', function (code) {
        done(code);
      });
    });
  });
});
