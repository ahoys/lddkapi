const log               = require('../../../debug')('routes:privileges').debug;
const Privilege         = require('../../models/privilegeSchema');
const authController    = require('../../controllers/auth');

module.exports = ((router) => {

    router.route('/privileges')

        .get(authController.isAuthenticated, (req, res) => {
            Privilege.find({ name: req.name }, '-_id name')
                .then((privileges) => {
                    if (privileges) {
                        return res.json(privileges);
                    }
                    else {
                        return res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    log('/privileges GET failed.', true, err);
                    return res.sendStatus(400);
                });
        })

        .post(authController.isAuthenticated, (req, res) => {
            new Privilege({ name: req.name })
                .save(() => {
                    res.json({ message: 'A new privilege saved.' });
                })
                .catch((err) => {
                    log('/privileges POST failed.', true, err);
                    return res.sendStatus(400);
                });
        });

    router.route('/privileges/:name')

        .delete(authController.isAuthenticated, (req, res) => {
            Privilege.findOne({ name: req.params.name })
                .then((privilege) => {
                    if (privilege) {
                        privilege.remove();
                        return res.json({ message: 'The privilege was removed.' });
                    }
                    else {
                        return res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    log('/privilege DELETE failed.', true, err);
                    return res.sendStatus(400);
                });
        });
});