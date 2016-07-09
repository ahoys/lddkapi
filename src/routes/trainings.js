const Training  = require('../models/trainingSchema');
const debug     = require('debug');
const log       = debug('Routes:Training');

module.exports = ((router) => {

    router.route('/trainings')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/trainings/:training_abbreviation')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});