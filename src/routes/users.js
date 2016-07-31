const debug             = require('../../debug');
const User              = require('../models/userSchema');
const authController    = require('../controllers/auth');

module.exports = ((router) => {

    // Resource: users
    router.route('/users')
        .get(authController.isAuthenticated, (req, res) => {
            User.find({}, '-_id username email')
                .then((users) => {
                    if (!users) {
                        // Users not found.
                        res.sendStatus(404);
                    }
                    else {
                        // Return users.
                        res.json(users);
                    }
                })
                .catch((err) => {
                    debug.error(err);
                    res.sendStatus(400);
                })
        })

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
            User.findOne({ username: req.params.username }, '-_id username email')
                .then((user) => {
                    if (!user) {
                        // User not found.
                        res.sendStatus(404);
                    }
                    else {
                        // Return user.
                        res.json(user);
                    }
                })
                .catch((err) => {
                    debug.error(err);
                    res.sendStatus(400);
                });
        })

        .put(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        // User not found.
                        res.sendStatus(404);
                    }
                    else if (String(user._id) !== String(req.user._id)) {
                        // User not authorized.
                        res.sendStatus(401);
                    }
                    else {
                        // Update user.
                        user.username = req.body.username ? req.body.username : req.user.username ;
                        user.password = req.body.password ? req.body.password : req.user.password ;
                        user.email = req.body.email ? req.body.email : req.user.email ;
                        user.save();
                        res.json({ message: 'The user has been updated.' });
                    }
                })
                .catch((err) => {
                    debug.error(err);
                    res.sendStatus(400);
                });
        })

        .delete(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        // User not found.
                        res.sendStatus(404);
                    }
                    else if (String(user._id) !== String(req.user._id)) {
                        // User not authorized.
                        res.sendStatus(401);
                    }
                    else {
                        // Remove user.
                        user.remove();
                        res.json({ message: 'The user was removed.' });
                    }
                })
                .catch((err) => {
                    debug.error(err);
                    res.sendStatus(400);
                });
        });
});