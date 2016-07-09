const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const MeetingSchema    = new Schema({
    abbreviation: {
        type: String,
        validation: [/^(?=.*[A-Z])[A-Z0-9ÄÖÅ]{2,16}$/, 'Abbreviation must be between 2-16 and only A-Z, 0-9'],
        required: true
    },
    title: {
        type: String,
        validation: [/^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{1,48}$/, 'Must have a-z or A-Z, and be between 3-48.'],
        required: true
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