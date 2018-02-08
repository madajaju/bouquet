const exec = require('child_process').exec;
const taction = require('../../controllers/<%- controller %>/<%- action %>');

describe('<%- controller %> <%- action %> Script Test Cases', function () {
  describe('Primary <%- controller %> <%- action %> Test Case', function () {
    it('Primary <%- controller %> <%- action %> Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bin/<%- projectName %>-<%- controller %>-<%- action %> ";
      let params = [];
      _.each(Object.keys(taction.inputs), function (key) {
        if(key != "mode") {
          params.push("--" + key + " " + taction.inputs[key].type);
        }
      });
      command += params.join(" ");
      let results = exec(command, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', function (code) {
        done(code);
      });
    });
  });
});
