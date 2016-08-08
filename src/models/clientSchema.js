const log           = require('../../debug')('models:clientSchema').debug;
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt        = require('bcryptjs');

/**
 * Clients like services and such.
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
 * Hook for handling changes in id or secret.
 * Is triggered by calls to save().
 */
ClientSchema.pre('save', (callback) => {

    // The client.
    const client = this;

    // Is the id or secret modified.
    if (!client.isModified('id') || !client.isModified('secret')) return callback(true);

    bcrypt.genSalt(5)
        .catch((err) => {
            log('Handling client save failed 1/4', true, err);
            callback(false);
        })
        .then((salt) => {
            // Hash the id.
            return bcrypt.hash(client.id, salt)
                .catch((err) => {
                    log('Handling client save failed 2/4', true, err);
                    callback(false);
                });
        })
        .then((id) => {
            client.id = id;
            return bcrypt.genSalt(5)
                .catch((err) => {
                    log('Handling client save failed 3/4', true, err);
                    callback(false);
                });
        })
        .then((salt) => {
            // Hash the secret.
            return bcrypt.hash(client.secret, salt)
                .catch((err) => {
                    log('Handling client save failed 4/4', true, err);
                    callback(false);
                });
        })
        .then((secret) => {
            client.secret = secret;
            callback(true);
        });
});

/**
 * Verifies the client.
 * @param id
 * @param secret
 * @param callback
 */
ClientSchema.methods.verifySecret = (id, secret, callback) => {

    // Compare identifications.
    bcrypt.compare(id, this.id)
        .then((isMatch) => {
            if (isMatch !== undefined && isMatch === true) {
                // Compare secrets.
                bcrypt.compare(secret, this.secret)
                    .then((isMatch) => {
                        if (isMatch !== undefined && isMatch === true) {
                            return callback(null, isMatch);
                        }
                        else {
                            return callback(null, false);
                        }
                    })
                    .catch((err) => {
                        log('Verifying secret failed.', true, err);
                        return callback(null, false);
                    });
            }
            else {
                return callback(null, false);
            }
        })
        .catch((err) => {
            log('Verifying secret failed.', true, err);
            return callback(null, false);
        });
};

module.exports = mongoose.model('Client', ClientSchema);