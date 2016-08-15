const log               = require('../../debug')('controllers:access').debug;
const User              = require('../models/userSchema');

module.exports = (resource = '') => {

    /**
     * Returns true if the user has access to the requested resource.
     * @param method
     * @param id
     */
    module.hasAccessToResource = (method, id) => {
        if (method === undefined || id === undefined) return false;
        const required = method + ' ' + resource;
        let hasAccess = false;
        User.findOne({ _id: id })
            .then((user) => {
                if (!user) return false;
                const roles = user.roles !== undefined && user.roles.constructor === Array
                    ? user.roles
                    : [] ;
                roles.forEach((role) => {
                    const privileges = role.privileges !== undefined && role.privileges.constructor === Array
                        ? role.privileges
                        : [] ;
                    privileges.forEach((privilege) => {
                        if (privilege === required) {
                            hasAccess = true;
                        }
                    });
                });
                return hasAccess;
            })
            .catch((err) => {
                log('hasAccessToResource() failed.', true, err);
                return false;
            })
    };

    return module;
};