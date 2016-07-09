const NewsItem  = require('../models/newsItemSchema');
const debug     = require('debug');
const log       = debug('Routes:News');

module.exports = ((router) => {

    router.route('/news')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/news/:newsItem_id')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});