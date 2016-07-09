const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const newsItemSchema    = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Not defined'
    },
    body: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    },
    published: {
        type: Date
    }
}, { strict: true });

module.exports = mongoose.model('NewsItem', newsItemSchema);