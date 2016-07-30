const passport          = require('passport');
const BasicStrategy     = require('passport-http').BasicStrategy;
const User              = require('../models/userSchema');

/**
 * Passport middleware.
 * Manages authentication for API endpoints.
 */
passport.use(new BasicStrategy((username, password, callback) => {

    // Look for the requested user.
    User.findOne({ name: username }, (err, user) => {

        // If search fails, callback with an error.
        if (err) { return callback(err); }

        // If user cannot be found, callback.
        if (!user) { return callback(null, false); }

        // Verify the given password against the user in the database.
        if (user.verifyPassword(password)) { return callback(null, false); }

        // Everything OK, return the user.
        return callback(null, user);
    });
}));

exports.isAuthenticated = passport.authenticate('basic', { session: false });