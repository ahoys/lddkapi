const log           = require('../../debug')('models:clientSchema').debug;
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt        = require('bcryptjs');

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
 * New ids and secrets are hashed automatically.
 * Returns callback() if successful, else callback(error message).
 */
ClientSchema.pre('save', function(callback) {

    // Catch the modifications.
    const client = this;
    const idModified = client.isModified('id');
    const secretModified = client.isModified('secret');
    const nameModified = client.isModified('name');
    const userIdModified = client.isModified('userId');

    // Callback if no changes detected.
    if (!idModified && !secretModified && !nameModified && !userIdModified) {
        callback();
    }

    // Promise hashed id.
    const promiseId = new Promise((resolve, reject) => {
        if (idModified) {
            bcrypt.genSalt(5, (err, salt) => {
                if (err) {
                    log('Salting id failed.', true, err);
                    reject(err);
                }
                else {
                    bcrypt.hash(client.id, salt, (err, hash) => {
                        if (err) {
                            log('Hashing id failed.', true, err);
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    });
                }
            });
        }
        else {
            resolve(false);
        }
    });

    // Promise hashed secret.
    const promiseSecret = new Promise((resolve, reject) => {
        if (secretModified) {
            bcrypt.genSalt(5, (err, salt) => {
                if (err) {
                    log('Salting secret failed.', true, err);
                    reject(err);
                }
                else {
                    bcrypt.hash(client.secret, salt, (err, hash) => {
                        if (err) {
                            log('Hashing secret failed.', true, err);
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    });
                }
            });
        }
        else {
            resolve(false);
        }
    });

    // Promise hashed name.
    const promiseName = new Promise((resolve, reject) => {
        if (nameModified) {
            bcrypt.genSalt(5, (err, salt) => {
                if (err) {
                    log('Salting secret failed.', true, err);
                    reject(err);
                }
                else {
                    bcrypt.hash(client.name, salt, (err, hash) => {
                        if (err) {
                            log('Hashing secret failed.', true, err);
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    });
                }
            });
        }
        else {
            resolve(false);
        }
    });

    // Promise hashed userId.
    const promiseUserId = new Promise((resolve, reject) => {
        if (userIdModified) {
            bcrypt.genSalt(5, (err, salt) => {
                if (err) {
                    log('Salting secret failed.', true, err);
                    reject(err);
                }
                else {
                    bcrypt.hash(client.userId, salt, (err, hash) => {
                        if (err) {
                            log('Hashing secret failed.', true, err);
                            reject(err)
                        }
                        else {
                            resolve(hash)
                        }
                    });
                }
            });
        }
        else {
            resolve(false);
        }
    });

    // Save credentials.
    Promise.all([promiseId, promiseSecret, promiseName, promiseUserId])
        .then(hashes => {
            client.id = hashes[0] !== false
                ? hashes[0]
                : client.id ;
            client.secret = hashes[1] !== false
                ? hashes[1]
                : client.secret;
            client.name = hashes[2] !== false
                ? hashes[2]
                : client.name ;
            client.userId = hashes[3] !== false
                ? hashes[3]
                : client.userId;
            callback();
        },
        reason => {
            log('Securing the client failed.', true, reason);
            callback(reason);
        });
});

/**
 * Verifies the client id and secret.
 * @param id
 * @param secret
 * @param callback
 */
ClientSchema.methods.verifyCredentials = function(id, secret, callback) {

    // Make sure all the required variables are available.
    if (id === undefined || secret === undefined) {
        const err = 'Missing arguments';
        log('Verifying the client failed.', true, err);
        callback(err, false);
    }

    // Promise id comparision.
    const promiseIdVerify = new Promise((resolve, reject) => {
       bcrypt.compare(id, this.id, (err, isMatch) => {
           if (err) {
               reject(err);
           }
           else {
               resolve(isMatch);
           }
       });
    });

    // Promise secret comparision.
    const promiseSecretVerify = new Promise((resolve, reject) => {
        bcrypt.compare(secret, this.secret, (err, isMatch) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(isMatch);
            }
        });
    });

    // Return the access.
    Promise.all([promiseIdVerify, promiseSecretVerify])
        .then(matches => {
            if (matches[0] && matches[1]){
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
        reason => {
            log('Verifying the client failed.', true, reason);
            callback(reason, false);
        });
};

module.exports = mongoose.model('Client', ClientSchema);