/**
 * Compares requested privilege to roles.
 * If a role has the privilege, true is returned.
 * @param privilege
 * @param roles
 * @returns {boolean}
 */
module.exports = (privilege, roles) => {
    if (
        privilege !== undefined &&
        typeof(privilege) === 'string' &&
        roles !== undefined &&
        roles.constructor === Array &&
        roles.length > 0
    ) {
        let hasPrivilege = false;
        roles.forEach((role) => {
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