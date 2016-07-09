const Meeting   = require('../models/meetingSchema');
const debug     = require('debug');
const log       = debug('Routes:Meetings');

module.exports = ((router) => {

    router.route('/meetings')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/meetings/:meeting_abbreviation')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});