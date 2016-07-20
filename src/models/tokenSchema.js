const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

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