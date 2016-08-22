const log       = require('../../debug')('routes:users').debug;
const User      = require('../models/userSchema');
const commands  = {};

// Collect command line arguments.
process.argv.forEach((arg) => {

    // Key and value pairs.
    const key   = arg.split('=')[0] !== undefined ? arg.split('=')[0] : false ;
    const value = arg.split('=')[1] !== undefined ? arg.split('=')[1] : undefined ;
    if (key !== false) {

        // Save commands to a command object.
        commands[key] = value !== undefined ? value : true ;
    }
});

module.exports = (() => {

    // Adds a new user.
    if (commands['+add_user']) {

        // Parse the required variables.
        const username  = commands['username']  ? commands['username']  : false ;
        const password  = commands['password']  ? commands['password']  : false ;
        const email     = commands['email']     ? commands['email']     : false ;

        // Validate and create.
        if (username !== false && password !== false && email !== false) {
            const user = new User();
            user.username = username;
            user.password = password;
            user.email = email;
            user.save(function (err) {
                if (err) {
                    log('A new user added.', true);
                }
                else {
                    log('Adding a new user failed.', true, err);
                }
            });
        }
    }
});