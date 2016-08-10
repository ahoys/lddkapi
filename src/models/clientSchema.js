const log           = require('../../debug')('models:clientSchema').debug;
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt        = require('bcryptjs');
const md5           = require('md5');

/**
 * Clients are external applications and services that
 * require user granted access to function.
 * Clients have identical permissions as their related users.
 */
const ClientSchema  = new Schema({
    // For easier identification.
    name: {
        type: String,
        unique: true,
        required: true
    },
    // Username.
    id: {
        type: String,
        required: true
    },
    // Part of OAuth2 flow.
    secret: {
        type: String,
        required: true
    },
    // Owner of the application client.
    userId: {
        type: String,
        required: true
    }
}, { strict: true });

/**
 * Middleware for detecting changes in client id and/or secret.
 * All ids and secrets are being hashed, only the name will stay as a plain text.
 * Returns callback() if successful, else callback(error message).
 */
ClientSchema.pre('save', function(callback) {

    const client = this;
    const idModified = client.isModified('id');
    const secretModified = client.isModified('secret');
    const userIdModified = client.isModified('userId');

    // Callback if no changes detected.
    if (!idModified && !secretModified && !userIdModified) {
        callback();
    }
    else {
        // md5 the modified data.
        client.id = idModified
            ? md5(client.id)
            : client.id ;
        client.userId = userIdModified
            ? md5(client.userId)
            : client.userId ;

        // Hash the secret.
        bcrypt.genSalt(5, (err, salt) => {
            if (err) {
                log('Salting the secret failed.', true, err);
                callback(err);
            }
            else {
                bcrypt.hash(client.secret, salt, (err, hash) => {
                    if (err) {
                        log('Hashing the secret failed.', true, err);
                        callback(err)
                    }
                    else {
                        client.secret = hash;
                        callback();
                    }
                });
            }
        });
    }
});

/**
 * Middleware for converting client ids to comparable md5.
 * The secret won't be converted.
 */
ClientSchema.pre('findOne', function (callback) {

    // Transfer plain id to md5-id.
    if (this && this._conditions) {

        // Hash the request id.
        if (this._conditions.id !== undefined) {
            this._conditions.id = md5(this._conditions.id);
        }

        // Hash the request userId.
        if (this._conditions.userId !== undefined) {
            this._conditions.userId = md5(this._conditions.userId);
        }
    }
    else {
        log('Client middleware for findOne failed.', true, 'Missing parameters.');
    }

    // If the hashing fails, the authorization will reject the client because of the mismatch.
    callback();
});

/**
 * Verifies the client id and secret.
 * @param secret
 * @param callback
 */
ClientSchema.methods.verifySecret = function(secret, callback) {

    // Make sure all the required variables are available.
    if (secret === undefined) {
        log('Verifying the client failed.');
        callback(null, false);
    }

    // Promise id comparision.
    bcrypt.compare(secret, this.secret, (err, isMatch) => {
        if (err) {
            log('Comparing secrets failed.', true, err);
            callback(err, false);
        }
        else {
            log('Verifying client secrets finished. Access: ', isMatch);
            callback(null, isMatch);
        }
    });
};

module.exports = mongoose.model('Client', ClientSchema);