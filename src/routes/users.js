const User      = require('../models/userSchema');
const config    = require('config').get('API.routes');
const debug     = require('debug');
let log         = debug('Routes:Users');

module.exports = ((router) => {

    // Resource: users
    router.route('/users')
        .get((request, response) => {
            // Find all users.
            User.find({}, '-_id name email lastModified lastAccess created access', (err, users) => {
                if(err || !users){
                    response.status(404).send({ message: 'The requested users were not found.' });
                    return false;
                }else{
                    // Users found.
                    log('GET successful.');
                    response.json(users);
                    return true;
                }
            });
        })

        .post((request, response) => {
                // Construct a new user.
                const user = new User({
                    name: request.body.name,
                    password: request.body.password,
                    email: request.body.email,
                    access: request.body.access
                });
                if (!user) {
                    response.status(500);
                    return false;
                }
                // Save the user.
                user.save((err) => {
                    if(err){
                        response.status(400).send(err);
                        return false;
                    }else{
                        // User saved.
                        log('POST successful.');
                        response.json({ message: 'New user added.' });
                        return true;
                    }
                });
        });

    // Resource: users/id
    router.route('/users/:user_name')
        .get((request, response) => {
                User.findOne(request.param.user_name, '-_id name email lastModified lastAccess created access', (err, user) => {
                    if(err || !user){
                        response.status(404).send({ message: 'The requested user was not found.' });
                        return false;
                    }else{
                        log('GET single user successful.');
                        response.json(user);
                        return true;
                    }
                });
        })

        .put((request, response) => {
                User.findById(request.params.user_id, (err, user) => {
                    // If errors while fetching the user.
                    if (err || !user) {
                        response.status(404).send({ message: 'The requested user was not found.' });
                        return false;
                    }
                    // Owner access can not be changed.
                    if(request.body.access != user.access){
                        if (user.access != 'owner') {
                            user.access = request.body.access;
                        } else {
                            log('PUT tried to modify owner.');
                            response.status(401).send('Modifying owner status is not allowed.');
                            return;
                        }
                    }
                    // Make the modifications.
                    user.name = request.body.name;
                    user.password = request.body.password;
                    user.email = request.body.email;
                    user.lastModified = Date.now();
                    // Save the modifications.
                    user.save((err) => {
                        if (err) {
                            response.status(400).send(err);
                            return false;
                        } else {
                            log('PUT successful.');
                            response.json({message: 'User modified'});
                            return true;
                        }
                    });
                });
        })

        .delete((request, response) => {
                User.remove({
                    _id: request.params.user_id
                }, (err, user) => {
                    if(err || !user){
                        response.status(404).send({ message: 'The requested user was not found.' });
                        return false;
                    }else{
                        log('DELETE successful.');
                        response.json({ message: 'User removed.' });
                        return true;
                    }
                });
        });
});