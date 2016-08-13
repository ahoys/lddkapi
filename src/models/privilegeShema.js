const log           = require('../../debug')('models:privilegeSchema').debug;
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Privileges are flags that grant a user a right to access some certain resource.
 * There can be many different privileges and the privileges that users have may vary.
 *
 * Only the users with a certain privilege may grant other users new privileges.
 */
const PrivilegeSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    }
}, { strict: true });

module.exports = mongoose.model('Privilege', PrivilegeSchema);