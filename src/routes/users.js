const User              = require('../models/userSchema');
const authController    = require('../controllers/auth');

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
                    response.json(users);
                    return true;
                }
            });
        })

        .post((req, res) => {
            // The requested user.
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            user.save((err) => {
                // Inform the client about the end result.
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                else {
                    res.json({ message: 'A new user saved.'} );
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
                        response.json({ message: 'User removed.' });
                        return true;
                    }
                });
        });
});