
module.exports = {

  friendlyName: '<%- controller %> <%- action %>',

  description: ' Add description ',

  inputs: {
    userId: {
      description: 'The ID of the user to look up.',
      // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
      // if the `userId` parameter is not a number.
      type: 'number',
      // By making the `userId` parameter required, Sails will automatically respond with
      // `res.badRequest` if it's left out.
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'welcome'
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    User.findOne(inputs.userId).exec(function (err, user) {

      // Handle unknown errors.
      if (err) {return exits.error(err);}

      // If no user was found, redirect to signup.
      if (!user) {return exits.notFound('/signup');}

      // Display the welcome view.
      return exits.success({name: user.name});
    });
  }
};

