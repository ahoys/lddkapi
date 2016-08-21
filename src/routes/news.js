const NewsItem          = require('../models/newsItemSchema');
const authController    = require('../controllers/auth');
const hasPrivilege      = require('../controllers/privileger');

module.exports = ((router) => {

    router.route('/news')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user)) return res.sendStatus(401);
        })

        .post(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('POST', req.user)) return res.sendStatus(401);
        });

    router.route('/news/:id')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user)) return res.sendStatus(401);
        })

        .put(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('PUT', req.user)) return res.sendStatus(401);
        })

        .delete(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('DELETE', req.user)) return res.sendStatus(401);
        });
});