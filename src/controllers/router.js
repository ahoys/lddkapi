const log       = require('../../debug')('controllers:router').debug;
const config_db = require('config').get('Database');

module.exports = ((express) => {

    const router = express.Router();

    /**
     * Localization middleware.
     * The supported languages are defined in the configs.
     * If the request does not specify localization or is not supported, default localization is used instead.
     */
    router.use((request, response, next) => {
        request.localization = config_db.get('localization').indexOf(request.header('Accept-Language')) !== -1
            ? request.header('Accept-Language')
            : 'en' ;
        next();
    });

    /**
     * Production error handler.
     * No stack traces returned to the user.
     * Use "return next(err);" to call.
     */
    router.use((err, request, response, next) => {
        log('Error handler got an error.', true, err);
        response.status(err.status || 500).send({
            message: 'Something went wrong. Please check your request.'
        });
    });

    // API Resources.
    require('../routes/api/users')(router);
    require('../routes/api/clients')(router);
    require('../routes/api/authorize')(router);
    require('../routes/api/token')(router);
    require('../routes/api/roles')(router);
    require('../routes/api/privileges')(router);

    // Regular Resources.
    require('../routes/decorations');
    require('../routes/meetings');
    require('../routes/members');
    require('../routes/news');
    require('../routes/ranks');
    require('../routes/ribbons');
    require('../routes/trainings');

    return router;
});