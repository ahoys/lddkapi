const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const UserSchema    = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: [/^([a-zA-Z]){3,24}$/, 'Name can only contain letters.']
    },
    password: {
        type: String,
        required: true,
        validate: [/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!#¤%&()=?\-_^@$€.,*]{6,64}$/, 'Password must be between 6-256 characters in length and contain numbers and lower- and uppercase letters.']
    },
    access: {
        type: String,
        default: 'regular',
        enum: ['regular', 'moderator', 'admin', 'owner']
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        min: 5,
        max: 244,
        validate: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Not valid email address.']
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastAccess: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);