const Decoration        = require('../models/decorationSchema');
const authController    = require('../controllers/auth');
const hasPrivilege      = require('../controllers/privileger');

module.exports = ((router) => {

    router.route('/decorations')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user.roles)) return res.sendStatus(401);
        })

        .post(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('POST', req.user.roles)) return res.sendStatus(401);
        });

    router.route('/decorations/:abbreviation')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user.roles)) return res.sendStatus(401);
        })

        .put(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('PUT', req.user.roles)) return res.sendStatus(401);
        })

        .delete(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('DELETE', req.user.roles)) return res.sendStatus(401);
        });
});