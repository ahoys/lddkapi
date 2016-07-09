const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const RankSchema        = new Schema({
    abbreviation: {
        type: String,
        validation: [/^(?=.*[A-Z])[A-Z0-9ÄÖÅ]{2,16}$/, 'Abbreviation must be between 2-16 and only A-Z, 0-9'],
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Ribbon', RankSchema);