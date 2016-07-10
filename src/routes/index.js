const debug                 = require('debug');
let log                     = debug('Routes:Users');
const express               = require('express');
const allowedMethods        = require('config').get('API.routes.allowedMethods');
const languages             = require('config').get('API.routes.languages');


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
                return false;
            }else{
                // Setup localization.
                const request_lang = request.header('Accept-Language');
                if(languages.indexOf(request_lang) !== -1){
                    request.localization = '.' + request_lang;
                    request.localization_response = request_lang;
                }else{
                    request.localization = '';
                    request.localization_response = languages;
                }
                next();
            }
        }catch(err){
            // Something went wrong.
            log('Middleware encountered an error: ', err);
            response.status(500).end();
            return false;
        }
    });

    // API routes.
    require('./users')(router);

    // Regular routes.
    require('./members')(router);
    // require('./ranks')(router);
    require('./decorations')(router);
    // require('./ribbons')(router);
    require('./trainings')(router);
    // require('./histories')(router);
    // require('./news')(router);

    return router;

});