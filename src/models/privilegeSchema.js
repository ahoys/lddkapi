const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Privileges are specified accesses to certain operations or resources.
 * Roles can hold from none to several privileges.
 */
const PrivilegeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [/^([a-zA-Z0-9ÄäÖöÅå: -_!?#.,]){2,32}$/, 'Privilege name can only contain: a-zA-Z0-9ÄäÖöÅå: -_!?#., (length: 2-32)']
    }
}, { strict: true });

module.exports = mongoose.model('Privilege', PrivilegeSchema);