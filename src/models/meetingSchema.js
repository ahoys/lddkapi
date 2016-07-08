const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const MeetingSchema    = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('Meeting', MeetingSchema);