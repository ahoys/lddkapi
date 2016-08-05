const authController    = require('../controllers/auth');
const oauth2Controller  = require('../controllers/oauth2');

module.exports = ((router) => {

    router.route('/oauth2/token')

        .post(authController.isClientAuthenticated, oauth2Controller.token);
});