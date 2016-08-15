const log               = require('../../debug')('controllers:access').debug;
const User              = require('../models/userSchema');

module.exports = (combinator = ' ') => {

    /**
     * Returns true if the user has access to the requested resource.
     * @param req
     * @param id
     */
    module.hasAccessToResource = (req, id) => {
        if (!req || !req.method || !req.url) return false;
        const required = req.method + combinator + req.url;
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