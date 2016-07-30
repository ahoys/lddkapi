const User              = require('../models/userSchema');
const config            = require('config').get('API.routes');
const debug             = require('debug');
const authController    = require('./auth');
const log               = debug('Routes:Users');

module.exports = ((router) => {

    // Resource: users
    router.route('/users')
        .get(authController.isAuthenticated, (request, response) => {
            // Find all users.
            User.find({}, '-_id name email', (err, users) => {
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

        .post(authController.isAuthenticated, (request, response) => {
                // Construct a new user.
                const user = new User({
                    name: request.body.name,
                    password: request.body.password,
                    email: request.body.email
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
        .get(authController.isAuthenticated, (request, response) => {
                User.findOne(request.param.user_name, '-_id name email', (err, user) => {
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

        .put(authController.isAuthenticated, (request, response) => {
            User.findOne(request.param.name, (err, user) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                user.name = request.body.name;
                user.password = request.body.password;
                user.email = request.body.email;
                user.save((err) => {
                    if(err){
                        response.status(400).send(err);
                        return false;
                    }
                    log('PUT ', user.name, ' successful.');
                    response.json({ message: 'The requested user was modified.' });
                    return true;
                });
            });
        })

        .delete(authController.isAuthenticated, (request, response) => {
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