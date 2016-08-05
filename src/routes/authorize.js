const authController    = require('../controllers/auth');
const oauth2Controller  = require('../controllers/oauth2');

module.exports = ((router) => {

    router.route('/oauth2/authorize')

        .get(authController.isAuthenticated, oauth2Controller.authorization)

        .post(authController.isAuthenticated, oauth2Controller.decision);
});