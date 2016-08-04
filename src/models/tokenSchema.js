const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Access tokens for clients.
 * The client uses an access token to make requests on behalf of the user.
 */
const TokenSchema   = new Schema({
    // Token value used when accessing the API on behalf of the user.
    value: {
        type: String,
        required: true
    },
    // Owner User.
    userId: {
        type: String,
        required: true
    },
    // Owner Client.
    clientId: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Token', TokenSchema);