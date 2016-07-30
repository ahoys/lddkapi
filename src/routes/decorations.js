const Decoration            = require('../models/decorationSchema');

module.exports = ((router) => {

    router.route('/decorations')

        .get((request, response) => {
            Decoration.find({},
                '-_id ' +
                'id ' +
                'localization ' +
                'abbreviation ' +
                'title ' +
                'description ',
                (err, decorations) => {
                    if(err){ return next(err); }
                    response.header('Content-Language', request.localization);
                    response.json(decorations);
                    return true;
            });
        })

        .post((request, response) => {
            const decoration = new Decoration({
                id: request.body.id,
                localization: request.body.localization,
                abbreviation: request.body.abbreviation,
                title: request.body.title,
                description: request.body.description
            });
            decoration.save((err) => {
                if(err){ return next(err); }
                response.json({ message: 'A new decoration added.' });
                return true;
            });
        })

        .delete((request, response) => {
            Decoration.remove({}, (err) => {
                if(err){ return next(err); }
                response.json({ message: 'The decorations were removed.' });
                return true;
            });
        });

    router.route('/decorations/:id')

        .get((request, response) => {
            Decoration.findOne(
                {id: request.params.id, localization: request.localization},
                '-_id ' +
                'id ' +
                'localization ' +
                'abbreviation ' +
                'title ' +
                'description ',
                (err, result) => {
                    if(err){ return next(err); }
                    if(!result){
                        response.status(404).json({ message: 'No content found.' });
                        return false;
                    }
                    response.header('Content-Language', request.localization);
                    response.json(result);
                    return true;
                });
        })

        .put((request, response) => {
            Decoration.findOne(
                {id: request.params.id, localization: request.localization},
                (err, result) => {
                    if(err){ return next(err); }
                    if(!result){
                        response.status(404).json({ message: 'No content found.' });
                        return false;
                    }
                    response.header('Content-Language', request.localization);
                    response.json(result);
                    return true;
                });
        })

        .delete((request, response) => {
            Decoration.remove({
                id: request.params.id
            }, (err) => {
                if(err){ return next(err); }
                response.json({ message: 'The requested decoration was removed.' });
                return true;
            });
        });

});