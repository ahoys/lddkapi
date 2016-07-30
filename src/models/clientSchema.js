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
    user: {
        type: String,
        required: true,
        lowercase: true,
        validate: [/^([a-zA-Z]){3,24}$/, 'Name can only contain letters.']
    }
}, { strict: true });

module.exports = mongoose.model('Client', ClientSchema);

// TODO: Hash the secret, perhaps even the id?
// TODO: Auto-generate secret and the userId.