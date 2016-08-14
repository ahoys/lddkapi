const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Privileges are specified accesses to certain operations or resources.
 * Roles can hold from none to several privileges.
 */
const PrivilegeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { strict: true });

module.exports = mongoose.model('Privilege', PrivilegeSchema);