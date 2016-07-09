const Rank      = require('../models/rankSchema');
const debug     = require('debug');
const log       = debug('Routes:Ranks');

module.exports = ((router) => {

    router.route('/ranks')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/ranks/:rank_abbreviation')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});