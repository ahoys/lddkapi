const Decoration    = require('../models/decorationSchema');
const debug         = require('debug');
const log           = debug('Routes:Decorations');

module.exports = ((router) => {

    router.route('/decorations')

        .get((request, response) => {
            Decoration.find({}, '-_id', (err, decorations) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                response.json(decorations);
                return true;
            })
        })

        .post((request, response) => {
            const decoration = new Decoration({
                abbreviation: {fi: request.body.abbreviation_fi, en: request.body.abbreviation_en},
                title: {fi: request.body.title_fi, en: request.body.title_en},
                description: {fi: request.body.description_fi, en: request.body.description_en}
            });
            decoration.save((err) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                response.json({ message: 'A new decoration added.' });
                return true;
            });
        });

    router.route('/decorations/:decoration')

        .get((request, response) => {
            Decoration.findOne({'abbreviation.en': request.params.decoration}, '-_id abbreviation title description', (err, decoration) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                response.json(decoration);
                return true;
            });
        })

        .put((request, response) => {

        })

        .delete((request, response) => {

        });

});