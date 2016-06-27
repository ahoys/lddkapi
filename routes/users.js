const User      = require('../models/user');
const config    = require('config').get('API.routes');
const log       = require('../util/debug');

module.exports = ((router) => {

    // Resource: users
    router.route('/users')
        .get((request, response) => {
            // Find all users.
            User.find((err, users) => {
                if(err){
                    // Could not fetch the users.
                    log('routes:users', 'GET /users failed: ' + err);
                    response.send(err);
                    return;
                }else{
                    // Users found.
                    log('routes:users', 'GET /users successful.');
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
            // Save the user.
            user.save((err) => {
                if(err){
                    // Could not save the user.
                    log('routes:users', 'POST /users failed: ' + err);
                    response.status(400).send(err);
                    return;
                }else{
                    // User saved.
                    log('routes:users', 'POST /users successful.');
                    response.json({ message: 'New user added.' });
                    return true;
                }
            });
        });

    // Resource: users/id
    router.route('/users/:user_id')
        .put((request, response) => {
            User.findById(request.params.user_id, (err, user) => {
                // If errors while fetching the user.
                if (err) {
                    log('routes:users', 'PUT /users/:user_id failed: ' + err);
                    response.status(400).send(err);
                    return;
                }
                // Owner access can not be changed.
                if(request.body.access != user.access){
                    if (user.access != 'owner') {
                        user.access = request.body.access;
                    } else {
                        log('routes:users', 'PUT /users/:user_id tried to modify owner.');
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
                        log('routes:users', 'PUT /users/:user_id failed: ' + err);
                        response.status(400).send(err);
                        return;
                    } else {
                        log('routes:users', 'PUT /users/:user_id successful.');
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
                if(err){
                    log('routes:users', 'DELETE /users/:user_id failed: ' + err);
                    response.status(400).send(err);
                    return;
                }else{
                    log('routes:users', 'DELETE /users/:user_id successful.');
                    response.json({ message: 'User removed.' });
                    return true;
                }
            });
        });

});