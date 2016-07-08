const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const RankSchema        = new Schema({
    abbreviation: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Ribbon', RankSchema);