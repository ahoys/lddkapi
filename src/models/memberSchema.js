const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const MemberSchema  = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    recruited: {
        type: Date,
        default: Date.now,
        required: true
    },
    _rank: {
        type: Schema.types.ObjectId,
        ref: 'Rank'
    },
    _training: {
        type: Schema.Types.ObjectId,
        ref: 'Training'
    },
    _group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    _medals: {
        type: [Schema.Types.ObjectId],
        ref: 'Medal'
    },
    _decorations: {
        type: [Schema.Types.ObjectId],
        ref: 'Decoration'
    },
    _ribbons: {
        type: [Schema.Types.ObjectId],
        ref: 'Ribbon'
    },
    _history: {
        type: [Schema.Types.ObjectId],
        ref: 'History'
    },
    _meetings: {
        type: [Schema.Types.ObjectId],
        ref: 'Meeting'
    }
}, { strict: true });

module.exports = mongoose.model('Member', MemberSchema);