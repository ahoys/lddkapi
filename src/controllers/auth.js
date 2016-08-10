const log               = require('../../debug')('controllers:auth').debug;
const passport          = require('passport');
const BasicStrategy     = require('passport-http').BasicStrategy;
const BearerStrategy    = require('passport-http-bearer').Strategy;
const User              = require('../models/userSchema');
const Client            = require('../models/clientSchema');
const Token             = require('../models/tokenSchema');
const bcrypt            = require('bcryptjs');

/**
 * isAuthenticated
 * Manages authentication for users.
 */
passport.use(new BasicStrategy((username, password, callback) => {

    User.findOne({ username: username })
        .then((user) => {
            if (user !== undefined) {
                user.verifyPassword(password, (err, isMatch) => {
                    if (err) {
                        log('Verifying the password failed.', true, err);
                        callback(null, false);
                    }
                    else {
                        log('User (' + username + ') was found. Access granted: ' + isMatch);
                        return isMatch
                            ? callback(null, user)
                            : callback(null, false) ;
                    }
                });
            }
            else {
                log('User could not be found.');
                return callback(null, false);
            }
        })
        .catch((err) => {
            log('User authentication failed.', true, err);
            return callback(null, false);
        });
}));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });

/**
 * isClientAuthenticated
 * Manages authentication for clients.
 */
passport.use('client-basic', new BasicStrategy((id, secret, callback) => {

    Client.findOne({ id: id })
        .then((client) => {
            if (client !== undefined) {
                client.verifySecret(secret, (err, isMatch) => {
                    if (err) {
                        log('Verifying the client failed', true, err);
                        callback(null, false);
                    }
                    else {
                        log('Client (' + id + ') was found. Access granted: ' + isMatch);
                        return isMatch
                            ? callback(null, client)
                            : callback(null, false) ;
                    }
                });
            }
        })
        .catch((err) => {
            log('Client authentication failed.', true, err);
            return callback(null, false);
        });
}));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });

/**
 * isBearerAuthenticated
 * Accepts requests from application clients using OAuth tokens and authenticates them.
 */
passport.use(new BearerStrategy((accessToken, callback) => {

    Token.findOne({ value: accessToken })
        .then((token) => {
            if (token) {
                User.findOne({ _id: token.userId })
                    .then((user) => {
                        if (user !== undefined) {
                            log('Token of (' + user.username + ') was successfully authenticated.');
                            callback(null, user, { scope: '*' });
                        }
                        else {
                            log('User registered for the token could not be found.');
                            return callback(null, false);
                        }
                    })
                    .catch((err) => {
                        log('Token authentication\'s user fetch failed.', true, err);
                        return callback(null, false);
                    });
            }
            else {
                log('Token could not be found.');
                return callback(null, false);
            }
        })
        .catch((err) => {
            log('Token authentication failed.', true, err);
            return callback(null, false);
        });
}));

exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });