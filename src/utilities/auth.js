const passport          = require('passport');
const BasicStrategy     = require('passport-http').BasicStrategy;
const User              = require('../models/userSchema');
const Client            = require('../models/clientSchema');

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

/**
 * Passport middleware.
 * Manages authentication for the client
 */
passport.use('client-basic', new BasicStrategy((name, password, callback) => {

    // Look for the requested user.
    Client.findOne({ name: name }, (err, client) => {

        // If search fails, callback with an error.
        if (err) { return callback(err); }

        // Client not found or wrong password.
        if (!client || client.secret !== password) { return callback(null, false); }

        // Everything OK, return the client.
        return callback(null, client);
    });
}));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });