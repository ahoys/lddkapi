const log               = require('../../debug')('routes:clients').debug;
const Client            = require('../models/clientSchema');
const authController    = require('../controllers/auth');

module.exports = ((router) => {

    router.route('/clients')

        .get(authController.isAuthenticated, (req, res) => {
            Client.find({ owner: req.user.username }, '-_id name owner')
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
            new Client({ name: req.body.name, secret: req.body.secret, owner: req.user.username })
                .save(() => {
                    // A new client saved.
                    res.json({ message: 'A new client saved.' });
                })
        });

    router.route('/clients/:name')

        .delete(authController.isAuthenticated, (req, res) => {
            Client.findOne({ name: req.params.name })
                .then((client) => {
                    if (!client) {
                        // A client not found.
                        res.sendStatus(404);
                    }
                    else if (String(client.owner) !== String(req.user.username)) {
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