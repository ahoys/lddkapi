const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Privilege     = require('./privilegeSchema');

/**
 * Roles are collections of different privileges.
 * An user can have from none to several roles.
 */
const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    privileges: {
        type: [Schema.Types.ObjectId],
        ref: 'Privilege'
    }
}, { strict: true });

module.exports = mongoose.model('Role', RoleSchema);