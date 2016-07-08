const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const MeetingSchema    = new Schema({
    abbreviation: {
        type: String,
        validation: [/^(?=.*[A-Z])[A-Z0-9]{2,16}$/, 'Abbreviation must be between 2-16 and only A-Z, 0-9'],
        required: true
    },
    title: {
        type: String,
        validation: [/^(?=.*[a-zA-Z])[a-zA-Z0-9äÄöÖåÅ! '"-.,*()]{3,48}$/, 'Must have a-z or A-Z, and be between 3-48.'],
        required: true
    },
    description: {
        type: String,
        validation: [/^(?=.*[a-zA-Z])[a-zA-Z0-9äÄöÖåÅ! '"-.,*()]{3,48}$/, 'Must have a-z or A-Z, and be between 3-48.']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('Meeting', MeetingSchema);