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
                        res.sendStatus(404);
                    }
                    else {
                        res.json(clients);
                    }
                })
                .catch((err) => {
                    log('/clients GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .post(authController.isAuthenticated, (req, res) => {

            // Auto-generates client id and secret.
            // These will be returned back to the user.
            const id = uuid();
            const secret = md5(uuid());

            new Client({ name: req.body.name, secret: secret, id: id, userId: req.user._id })
                .save(() => {
                    res.json({
                        message: 'A new client saved. Please store your secret and id in a safe place.',
                        secret: secret,
                        id: id
                    });
                })
                .catch((err) => {
                    log('/clients POST failed.', true, err);
                    res.sendStatus(400);
                });
        });

    router.route('/clients/:name')

        .delete(authController.isAuthenticated, (req, res) => {
            Client.findOne({ name: req.params.name })
                .then((client) => {
                    if (!client) {
                        res.sendStatus(404);
                    }
                    else if (client.userId !== String(req.user._id)) {
                        res.sendStatus(401);
                    }
                    else {
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