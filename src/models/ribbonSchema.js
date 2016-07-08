const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const RibbonSchema    = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { strict: true });

module.exports = mongoose.model('Ribbon', RibbonSchema);