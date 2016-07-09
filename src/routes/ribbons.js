const Ribbon    = require('../models/ribbonSchema');
const debug     = require('debug');
const log       = debug('Routes:Ribbons');

module.exports = ((router) => {

    router.route('/ribbons')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/ribbons/:ribbon_abbreviation')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});