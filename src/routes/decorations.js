const Decoration            = require('../models/decorationSchema');

module.exports = ((router) => {

    router.route('/decorations')

        .get((request, response) => {
            Decoration.find({},
                '-_id' +
                ' abbreviation' + request.localization +
                ' title' + request.localization +
                ' description' + request.localization,
                (err, decorations) => {
                    if(err){ return next(err); }
                    response.header('Content-Language', request.localization_response);
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
                if(err){ return next(err); }
                response.json({ message: 'A new decoration added.' });
                return true;
            });
        });

    router.route('/decorations/:decoration')

        .get((request, response) => {
            const target = {};
            target['abbreviation' + request.localization] = request.params.decoration;
            Decoration.findOne(
                target,
                '-_id' +
                ' abbreviation' + request.localization +
                ' title' + request.localization +
                ' description' + request.localization,
                (err, decoration) => {
                    if(err){ return next(err); }
                    response.header('Content-Language', request.localization_response);
                    if(!decoration){
                        response.status(404).json({
                            message: 'No content. Make sure you have set Accept-Language Header'
                        });
                    }else{
                        response.json(decoration);
                    }
                    return true;
            });
        })

        .put((request, response) => {

        })

        .delete((request, response) => {
            Decoration.remove({
                abbreviation: request.params.abbreviation
            }, (err, decoration) => {
                if(err){ return next(err); }
                response.json({ message: 'The requested decoration was removed.' });
                return true;
            });
        });

});