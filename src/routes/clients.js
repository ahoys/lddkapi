const log               = require('../../debug')('routes:clients').debug;
const Client            = require('../models/clientSchema');
const authController    = require('../controllers/auth');
const uuid              = require('uuid').v4;
const md5               = require('md5');

module.exports = ((router) => {

    router.route('/clients')

        .get(authController.isAuthenticated, (req, res) => {
            Client.find({ userId: req.user._id }, '-_id name')
                .then((clients) => {
                    if (!clients) {
                        // Clients not found.
                        res.sendStatus(404);
                    }
                    else {
                        // Return clients.
                        res.json(clients);
                    }
                })
                .catch((err) => {
                    log('/clients GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .post(authController.isAuthenticated, (req, res) => {

            // Make sure the required parameters are available.
            if (!req || !req.body || !req.body.name) {
                log('/clients POST failed.', true, 'Missing required parameters.');
                res.sendStatus(400);
            }

            // Generate md5 hashes of the provided parameters.
            const secret = md5(uuid());
            const id = uuid();

            // Save the a new client.
            new Client({ name: req.body.name, secret: secret, id: id, userId: req.user._id })
                .save()
                .catch((err) => {
                    log('/clients POST failed.', true, err);
                    res.sendStatus(400);
                }, () => {
                    res.json({
                        message: 'A new client saved. Please store your secret and id in a safe place.',
                        secret: secret,
                        id: id
                    });
                });
        });

    router.route('/clients/:name')

        .delete(authController.isAuthenticated, (req, res) => {
            Client.findOne({ name: req.params.name })
                .then((client) => {
                    if (!client) {
                        // A client not found.
                        res.sendStatus(404);
                    }
                    else if (String(client.userId) !== String(req.user._id)) {
                        // A user not authorized.
                        res.sendStatus(401);
                    }
                    else {
                        // Remove a user.
                        client.remove();
                        res.json({ message: 'The client was removed.' });
                    }
                })
                .catch((err) => {
                    log('/client DELETE failed.', true, err);
                    res.sendStatus(400);
                });
        });
});