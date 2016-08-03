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
    // Part of OAuth2 flow.
    secret: {
        type: String,
        required: true
    },
    // Owner of the application client.
    username: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Client', ClientSchema);

// TODO: Hash the secret, perhaps even the id?
// TODO: Auto-generate secret and the userId.