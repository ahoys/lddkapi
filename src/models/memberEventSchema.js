const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const memberEventSchema = new Schema({
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
    title: {
        type: String,
        required: true,
        validation: /^[a-zA-Z0-9 äÄöÖåÅ_!-]{2,48}$/
    },
    body: {
        type: String,
        default: 'Not defined',
        validation: /^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{3,1024}$/
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('MemberEvent', memberEventSchema);