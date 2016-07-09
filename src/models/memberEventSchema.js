const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const memberEventSchema = new Schema({
    _subject: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    title: {
        type: String,
        validation: [/^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{1,48}$/, 'Must have a-z or A-Z, and be between 3-48.'],
        default: 'Not defined'
    },
    body: {
        type: String,
        default: 'Not defined',
        validation: [/^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{3,1024}$/, 'Invalid characters or the length is not in between 3 and 1024.']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('MemberEvent', memberEventSchema);