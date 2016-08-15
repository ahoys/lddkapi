const log               = require('../../debug')('routes:users').debug;
const User              = require('../models/userSchema');
const authController    = require('../controllers/auth');
const resourceAccess    = require('../controllers/access')('-').hasAccessToResource;

module.exports = ((router) => {

    router.route('/users')

        .get(authController.isAuthenticated, (req, res) => {
            if (!resourceAccess(req, req.user._id)) return res.sendStatus(401);
            User.find({}, '-_id username email')
                .then((users) => {
                    if (!users) {
                        res.sendStatus(404);
                    }
                    else {
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
                    res.json({ message: 'A new user saved.' });
                })
                .catch((err) => {
                    log('/users POST failed.', true, err);
                    res.sendStatus(400);
                });
        });

    router.route('/users/:username')

        .get(authController.isAuthenticated, (req, res) => {
            if (!resourceAccess(req, req.user._id)) return res.sendStatus(401);
            User.findOne({ username: req.params.username }, '-_id username email')
                .then((user) => {
                    if (!user) {
                        res.sendStatus(404);
                    }
                    else {
                        res.json(user);
                    }
                })
                .catch((err) => {
                    log('/user GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .put(authController.isAuthenticated, (req, res) => {
            if (!resourceAccess(req, req.user._id)) return res.sendStatus(401);
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        res.sendStatus(404);
                    }
                    else if (user._id !== String(req.user._id)) {
                        res.sendStatus(401);
                    }
                    else {
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
            if (!resourceAccess(req, req.user._id)) return res.sendStatus(401);
            User.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        res.sendStatus(404);
                    }
                    else if (user._id !== String(req.user._id)) {
                        res.sendStatus(401);
                    }
                    else {
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