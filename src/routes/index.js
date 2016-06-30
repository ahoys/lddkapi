const log                   = require('../util/debug');
const allowedMethods        = require('config').get('API.routes.allowedMethods');
const express               = require('express');

module.exports = ((express) => {

    // The router.
    const router = express.Router();

    // Middleware to use for all requests.
    router.use((request, response, next) => {
        try{
            if(allowedMethods.indexOf(request.method) < 0){
                // Method not allowed.
                log('routes:index', 'received request ' + request.method + ' was unrecognized and ignored.');
                response.status(405).end('Allowed methods: ' + allowedMethods);
                return;
            }else{
                next();
            }
        }catch(err){
            // Something went wrong.
            log('routes:index', 'something went wrong: ' + err);
            response.status(500).end();
            return;
        }
    });

    // API routes.
    require('./users')(router);

    // Regular routes.
    require('./members')(router);
    // require('./ranks')(router);
    // require('./decorations')(router);
    // require('./ribbons')(router);
    // require('./trainings')(router);
    // require('./histories')(router);
    // require('./news')(router);

    return router;

});