const debug             = require('../../debug');
const User              = require('../models/userSchema');
const authController    = require('../controllers/auth');

module.exports = ((router) => {

    // Resource: users
    router.route('/users')
        .get(authController.isAuthenticated, (req, res) => {
            User.find({}, '-_id username email', (err, result) => {
                if (err) {
                    debug.error(err);
                    res.sendStatus(400);
                }
                else {
                    res.json(result);
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
                    debug.error(err);
                    res.sendStatus(400);
                }
                else {
                    res.json({ message: 'A new user saved.'} );
                }
            });
        });

    // Resource: users/id
    router.route('/users/:username')
        .get(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username }, '-_id username email', (err, result) => {
                if (err) {
                    debug.error(err);
                    res.sendStatus(400);
                }
                else {
                    res.json(result);
                }
            });
        })

        .put(authController.isAuthenticated, (req, res) => {
            if (req.user.username !== req.params.username) { res.sendStatus(401); return false }
            User.update({
                username: req.params.username
            }, {
                username: req.body.username ? req.body.username : req.user.username ,
                password: req.body.password ? req.body.password : req.user.password ,
                email: req.body.email ? req.body.email : req.user.email ,
            }, (err, num, raw) => {
                if (err) {
                    debug.error(err);
                    res.sendStatus(400);
                }
                else {
                    res.json({ message: 'The user was updated.' })
                }
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