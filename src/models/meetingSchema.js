const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const MeetingSchema    = new Schema({
    id: {
        type: String,
        required: true,
        validation: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,16}$/
    },
    localization: {
        type: String,
        required: true,
        validation: /^([a-zA-Z-]){2,6}$/
    },
    abbreviation: {
        type: String,
        required: true,
        validation: /^(?=.*[a-zA-Z])[a-zA-Z0-9ÄäÖöÅå_-]{2,16}$/
    },
    title: {
        type: String,
        required: true,
        validation: /^[a-zA-Z0-9 äÄöÖåÅ_!-]{2,48}$/
    },
    description: {
        type: String,
        validation: [/^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{3,1024}$/, 'Invalid characters or the length is not in between 3 and 1024.']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('Meeting', MeetingSchema);