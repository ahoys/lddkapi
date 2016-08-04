const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Stores authorization codes generated in the OAuth2 flow.
 */
const CodeSchema    = new Schema({
    // Authorization code.
    value: {
        type: String,
        required: true
    },
    // Redirect uri supplied in the initial authorization process.
    redirectUri: {
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

module.exports = mongoose.model('Code', CodeSchema);