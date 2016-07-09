const debug                 = require('debug');
let log                     = debug('Routes:Users');
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
                log('The request was unrecognized.');
                response.status(405).end('Allowed methods: ' + allowedMethods);
                return;
            }else{
                next();
            }
        }catch(err){
            // Something went wrong.
            log('Middleware encountered an error: ', err);
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
    require('./trainings')(router);
    // require('./histories')(router);
    // require('./news')(router);

    return router;

});