var request = require("supertest-as-promised");

describe('Controller <%- controller %> <% action %> Test Cases', function () {
  describe('Primary Controller <%- controller %> <%- action %> Test Case', function () {
    // Requires an environment and stack be created first.
    it('Primary Controller <%- controller %> <%- action %> Good Path', function (done) {
      request(sails.hooks.http.app)
        .get('/<%- controller %>/<%- action %>?param=paramName')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          else {
            done();
          }
        });
    });
  });
});
