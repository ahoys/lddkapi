const Decoration            = require('../models/decorationSchema');
const debug                 = require('debug');
const languages             = require('config').get('API.routes.languages');

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
            const lang = languages.indexOf(request.header('Accept-Language')) !== -1
                ? '.' + request.header('Accept-Language')
                : '' ;
            console.log(lang);
            Decoration.findOne(
                request.params.decoration,
                '-_id' +
                ' abbreviation' + lang +
                ' title' + lang +
                ' description' + lang,
                (err, decoration) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                response.header('Content-Language', request.header('Accept-Language'));
                response.json(decoration);
                return true;
            });
        })

        .put((request, response) => {

        })

        .delete((request, response) => {
            Decoration.remove({
                abbreviation: request.params.abbreviation
            }, (err, decoration) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                response.json({ message: 'The requested decoration was removed.' });
                return true;
            });
        });

});