const Decoration            = require('../models/decorationSchema');
const acceptLanguage        = require('accept-language');
const debug                 = require('debug');
const log                   = debug('Routes:Decorations');
acceptLanguage.languages    = (['en-US', 'fi-FI']);

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
            let lang = acceptLanguage.get(request.header('Accept-Language'));
            console.log(lang);
            lang = lang !== void 0 ? '.' + lang : '.en' ;
            const target = {};
            target['abbreviation' + lang] = request.params.decoration;
            console.log(target);
            Decoration.findOne(
                target,
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

        });

});