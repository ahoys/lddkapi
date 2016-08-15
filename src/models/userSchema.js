const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Role          = require('./roleSchema');
const bcrypt        = require('bcryptjs');

/**
 * Users are the main actors in this API.
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: [/^([a-zA-Z]){3,24}$/, 'Name can only contain letters.']
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        min: 5,
        max: 244,
        validate: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Not valid email address.']
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
}, { strict: true });

/**
 * Middleware for detecting changes in user password.
 * Returns callback() if successful, else callback(error message).
 */
UserSchema.pre('save', function(callback) {

    const user = this;
    const passwordModified = user.isModified('password');

    if (passwordModified) {
        bcrypt.genSalt(5, function(err, salt) {
            if (err) {
                callback(err);
            }
            else {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        user.password = hash;
                        callback();
                    }
                });
            }
        });
    }
    else {
        callback();
    }
});

/**
 * Verifies the user password.
 * @param password
 * @param callback
 * @callback (error, boolean)
 */
UserSchema.methods.verifyPassword = function(password, callback) {

    if (password) {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                callback(err, false);
            }
            else {
                callback(null, isMatch);
            }
        });
    }
    else {
        callback('verifyPassword() is missing a parameter.', false);
    }
};

module.exports = mongoose.model('User', UserSchema);