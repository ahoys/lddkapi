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
            User.findOne({ username: req.params.username }, (err, result) => {
                if (err) {
                    debug.error(err);
                    res.sendStatus(400);
                }
                else if (String(result._id) !== String(req.user._id)) {
                    res.sendStatus(401);
                }
                else {
                    result.username = req.body.username ? req.body.username : req.user.username ;
                    result.password = req.body.password ? req.body.password : req.user.password ;
                    result.email = req.body.email ? req.body.email : req.user.email ;
                    result.save((err) => {
                        if (err) {
                            debug.error(err);
                            res.sendStatus(400);
                        }
                        else {
                            res.json({ message: 'The user has been updated.' });
                        }
                    });
                }
            });
        })

        .delete(authController.isAuthenticated, (req, res) => {
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        res.sendStatus(404);
                    }
                    else if (String(user._id) === String(req.user._id)) {
                        user.remove();
                        res.json({ message: 'The user was removed.' });
                    }
                    else {
                        res.sendStatus(401);
                    }
                })
                .catch((err) => {
                    debug.error(err);
                    res.sendStatus(400);
                });
        });
});