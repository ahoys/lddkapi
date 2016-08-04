const log               = require('../../debug')('controllers:auth').debug;
const passport          = require('passport');
const BasicStrategy     = require('passport-http').BasicStrategy;
const User              = require('../models/userSchema');
const Client            = require('../models/clientSchema');

/**
 * Passport middleware.
 * Manages authentication for users.
 */
passport.use(new BasicStrategy((username, password, callback) => {

    User.findOne({ username: username })
        .then((user) => {
            if (user) {
                user.verifyPassword(password, (err, isMatch) => {
                    if (err) {
                        log('Verifying the password failed.', true, err);
                    }
                    else {
                        return isMatch ? callback(null, user) : callback(null, false) ;
                    }
                });
            }
            else {
                log('User could not be found.');
                return callback(null, false);
            }
        })
        .catch((err) => {
            log('User authenticating failed.', true, err);
            return callback(null, false);
        });
}));

exports.isAuthenticated = passport.authenticate('basic', { session: false });

/**
 * Passport middleware.
 * Manages authentication for clients.
 */
passport.use('client-basic', new BasicStrategy((name, password, callback) => {

    Client.findOne({ owner: name })
        .then((client) => {
            if (client && client.secret === password) {
                return callback(null, client);
            }
            else {
                log('Invalid client logon.');
                return callback(null, false);
            }
        })
        .catch((err) => {
            log('Client authenticating failed.', true, err);
            return callback(null, false);
        });
}));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });