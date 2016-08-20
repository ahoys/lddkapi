const log               = require('../../../debug')('routes:roles').debug;
const Role              = require('../../models/roleSchema');
const authController    = require('../../controllers/auth');

module.exports = ((router) => {

    router.route('/roles')

        .get(authController.isAuthenticated, (req, res) => {
            Role.find({ name: req.name }, '-_id name')
                .then((roles) => {
                    if (roles) {
                        return res.json(roles);
                    }
                    else {
                        return res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    log('/roles GET failed.', true, err);
                    return res.sendStatus(400);
                });
        })

        .post(authController.isAuthenticated, (req, res) => {
            new Role({ name: req.name })
                .save(() => {
                    res.json({ message: 'A new role saved.' });
                })
                .catch((err) => {
                    log('/roles POST failed.', true, err);
                    return res.sendStatus(400);
                });
        });

    router.route('/roles/:name')

        .delete(authController.isAuthenticated, (req, res) => {
            Role.findOne({ name: req.params.name })
                .then((role) => {
                    if (role) {
                        role.remove();
                        return res.json({ message: 'The role was removed.' });
                    }
                    else {
                        return res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    log('/role DELETE failed.', true, err);
                    return res.sendStatus(400);
                });
        });
});