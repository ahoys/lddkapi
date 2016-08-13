const log           = require('../../debug')('models:privilegeSchema').debug;
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

/**
 * Accesses are documents that grant users accesses to specified resources.
 */
const AccessSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ['website', 'application', 'moderator', 'admin']
    },
    resources: {
        type: [String],
        required: true,
        lowercase: true
    }
}, { strict: true });

/**
 * Verifies access to a certain resource.
 * Verifying is done by comparing the given resource against Access' resources listings, if the resource is
 * found from the listing, true is returned.
 * @param resource
 * @param callback
 */
AccessSchema.methods.verifyAccess = function(resource, callback) {

    const maxIndex = 3;

    if (this === undefined) {
        callback(
            'Access is not defined.',
            false
        );
    }
    else if (typeof(resource) !== 'string') {
        callback(
            'Access resource should be type of String, but is type of: ' + typeof(resource) + ' instead.',
            false
        );
    }
    else if (this.resources === undefined) {
        callback(
            'Could not find the resources of Access: ' + this.name,
            false
        );
    }
    else {
        const index = this.resources.indexOf(resource);
        if (index <= maxIndex && index >= 0) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    }
};

module.exports = mongoose.model('Access', AccessSchema);