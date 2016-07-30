const express       = require('express');
const config_app    = require('config').get('Application');

module.exports = ((express) => {

    const router = express.Router();

    /**
     * The main middleware for requests.
     */
    router.use((request, response, next) => {
        // Setup localization.
        request.localization = config_app.get('router.localization').indexOf(request.header('Accept-Language')) !== -1
            ? request.header('Accept-Language')
            : 'en' ;
        // Begin actual processing.
        next();
    });

    /**
     * Production error handler.
     * No stack traces given.
     * Use "return next(err);" to call.
     */
    router.use((err, request, response, next) => {
        response.status(err.status || 500).send({
            message: err.message,
            error: {}
        });
    });

    // API routes.
    require('./../routes/users')(router);
    // require('./clients')(router);

    // Regular routes.
    // require('./members')(router);
    // require('./ranks')(router);
    // require('./decorations')(router);
    // require('./ribbons')(router);
    // require('./trainings')(router);
    // require('./histories')(router);
    // require('./news')(router);

    return router;

});