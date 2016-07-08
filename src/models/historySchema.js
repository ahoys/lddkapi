const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const HistorySchema = new Schema({
    _subject: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    title: {
        type: String,
        default: 'Not defined'
    },
    body: {
        type: String,
        default: 'Not defined'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

module.exports = mongoose.model('History', HistorySchema);