/**
 * Compares requested privilege to roles.
 * If a role has the privilege, true is returned.
 * @param privilege
 * @param req_user
 * @returns {boolean}
 */
module.exports = (privilege, req_user) => {

    if (
        privilege !== undefined &&
        typeof(privilege) === 'string' &&
        req_user !== undefined &&
        req_user.roles !== undefined &&
        req_user.roles.constructor === Array &&
        req_user.length > 0
    ) {
        let hasPrivilege = false;
        req_user.roles.forEach((role) => {
            const privileges = role.privileges !== undefined && role.privileges.constructor === Array
                ? role.privileges
                : [] ;
            privileges.forEach((rolePrivilege) => {
                if (rolePrivilege === privilege) {
                    hasPrivilege = true;
                }
            });
        });
        return hasPrivilege;
    }
    else {
        return false;
    }
};