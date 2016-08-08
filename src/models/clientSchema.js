const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

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

module.exports = mongoose.model('Client', ClientSchema);