const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const DecorationSchema    = new Schema({
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
        validation: /^[a-zA-Z0-9 äÄöÖåÅ]{2,48}$/
    },
    description: {
        type: String,
        required: true,
        validation: /^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{3,1024}$/
    }
}, { strict: true });

DecorationSchema.index({id: 1, localization: -1}, { unique: true });

module.exports = mongoose.model('Decoration', DecorationSchema);