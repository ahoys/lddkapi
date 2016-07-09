const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const MemberSchema  = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        validate: [/^([a-zA-Z0-9AäÖöÅå !_-]){1,32}$/, 'Nickname can only contain a-zA-Z0-9AäÖöÅå !_- and be 1-32 in length.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 244,
        validate: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Not valid email address.']
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