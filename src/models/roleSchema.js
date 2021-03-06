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
        lowercase: true,
        unique: true,
        validate: [/^([a-zA-Z0-9ÄäÖöÅå: -_!?#.,]){2,32}$/, 'Role name can only contain: a-zA-Z0-9ÄäÖöÅå: -_!?#., (length: 2-32)']
    },
    privileges: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Privilege'
        }
    ]
}, { strict: true });

module.exports = mongoose.model('Role', RoleSchema);