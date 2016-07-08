const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const TrainingSchema    = new Schema({
    title: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Training', TrainingSchema);