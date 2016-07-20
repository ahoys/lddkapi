const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Stores authorization codes generated in the OAuth2 flow.
 */
const CodeSchema    = new Schema({
    value: {
        type: String,
        required: true
    },
    redirectUri: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Code', CodeSchema);