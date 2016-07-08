const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const memberSchema  = new Schema({
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
        default: Date.now
    },
    rank: {
        type: Schema.types.ObjectId,
        ref: 'Rank'
    },
    training: {
        type: Schema.Types.ObjectId,
        ref: 'Training'
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    medals: {
        type: [Schema.Types.ObjectId],
        ref: 'Medal'
    },
    decorations: {
        type: [Schema.Types.ObjectId],
        ref: 'Decoration'
    },
    ribbons: {
        type: [Schema.Types.ObjectId],
        ref: 'Ribbon'
    },
    history: {
        type: [Schema.Types.ObjectId],
        ref: 'MemberHistory'
    },
    meetings: {
        type: [Schema.Types.ObjectId],
        ref: 'Meeting'
    }
}, { strict: true });

module.exports = mongoose.model('Member', memberSchema);