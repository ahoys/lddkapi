const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const DecorationSchema    = new Schema({
    name: {
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
        validation: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,16}$/
    },
    title: {
        type: String,
        required: true,
        validation: /^[a-zA-Z0-9 äÄöÖåÅ]{2,48}$/
    }
}, { strict: true });

module.exports = mongoose.model('Decoration', DecorationSchema);