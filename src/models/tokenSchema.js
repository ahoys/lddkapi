const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Access tokens for clients.
 */
const TokenSchema   = new Schema({
    value: {
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

module.exports = mongoose.model('Token', TokenSchema);