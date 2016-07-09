const Decoration    = require('../models/decorationSchema');
const debug         = require('debug');
const log           = debug('Routes:Decorations');

module.exports = ((router) => {

    router.route('/decorations')

        .get((request, response) => {

        })

        .post((request, response) => {

        });

    router.route('/decorations/:decoration_abbreviation')

        .get((request, response) => {

        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});