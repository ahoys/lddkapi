const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const MemberEvent   = require('../models/memberEventSchema');

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
    memberEvents: {
        type: [MemberEvent]
    },
    rank: {
        type: Schema.Types.ObjectId,
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
    meetings: {
        type: [Schema.Types.ObjectId],
        ref: 'Meeting'
    }
}, { strict: true });

module.exports = mongoose.model('Member', MemberSchema);