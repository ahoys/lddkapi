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
    name: {
        type: String,
        unique: true,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
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
    const userIdModified = client.isModified('userId');
    const secretModified = client.isModified('secret');

    if (idModified || userIdModified || secretModified) {
        client.id = idModified
            ? md5(client.id)
            : client.id ;
        client.userId = userIdModified
            ? md5(client.userId)
            : client.userId ;
        if(secretModified){
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
        else {
            callback();
        }
    }
});

/**
 * Middleware findOne for converting client id and userId to comparable md5.
 */
ClientSchema.pre('findOne', function(callback) {

    if (this && this._conditions) {
        if (this._conditions.id !== undefined) {
            this._conditions.id = md5(this._conditions.id);
        }
        if (this._conditions.userId !== undefined) {
            this._conditions.userId = md5(this._conditions.userId);
        }
        callback();
    }
    else {
        log('Client middleware for findOne failed.', true, 'Missing parameters.');
        callback('Missing parameters.');
    }
});

/**
 * Middleware find for converting userId to searchable md5.
 */
ClientSchema.pre('find', function(callback) {

    if (this && this._conditions) {
        if (this._conditions.userId !== undefined) {
            this._conditions.userId = md5(this._conditions.userId);
        }
        callback();
    }
    else {
        log('Client middleware for find failed.', true, 'Missing parameters.');
        callback('Missing parameters.');
    }
});

/**
 * Verifies the client id and secret.
 * @param secret
 * @param callback
 */
ClientSchema.methods.verifySecret = function(secret, callback) {

    if (secret) {
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
    }
    else {
        log('Verifying the client failed.', true, 'Missing secret.');
        callback(null, false);
    }
};

module.exports = mongoose.model('Client', ClientSchema);