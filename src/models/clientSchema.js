const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Clients like services and such.
 */
const ClientSchema  = new Schema({
    name: {
        type: String,
        unique: true,
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

module.exports = mongoose.model('Client', ClientSchema);