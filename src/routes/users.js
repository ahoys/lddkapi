const log               = require('../../debug')('routes:users').debug;
const User              = require('../models/userSchema');
const authController    = require('../controllers/auth');

module.exports = ((router) => {

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
                    log('/users GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .post((req, res) => {
            new User({ username: req.body.username, password: req.body.password, email: req.body.email })
                .save(() => {
                    // A new user saved.
                    res.json({ message: 'A new user saved.' });
                })
                .catch((err) => {
                    log('/users POST failed.', true, err);
                    res.sendStatus(400);
                });
        });

    router.route('/users/:username')

        .get(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username }, '-_id username email')
                .then((user) => {
                    if (!user) {
                        // A user not found.
                        res.sendStatus(404);
                    }
                    else {
                        // Return a user.
                        res.json(user);
                    }
                })
                .catch((err) => {
                    log('/user GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .put(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        // A user not found.
                        res.sendStatus(404);
                    }
                    else if (String(user._id) !== String(req.user._id)) {
                        // A user not authorized.
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
                    log('/user PUT failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .delete(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        // A user not found.
                        res.sendStatus(404);
                    }
                    else if (String(user._id) !== String(req.user._id)) {
                        // A user not authorized.
                        res.sendStatus(401);
                    }
                    else {
                        // Remove a user.
                        user.remove();
                        res.json({ message: 'The user was removed.' });
                    }
                })
                .catch((err) => {
                    log('/user DELETE failed.', true, err);
                    res.sendStatus(400);
                });
        });
});