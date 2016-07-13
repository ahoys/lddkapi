const Decoration            = require('../models/decorationSchema');

module.exports = ((router) => {

    router.route('/decorations')

        .get((request, response) => {
            Decoration.find({},
                '-_id ' +
                'name ' +
                'localization ' +
                'abbreviation ' +
                'title ',
                (err, decorations) => {
                    if(err){ return next(err); }
                    response.header('Content-Language', request.localization);
                    response.json(decorations);
                    return true;
            });
        })

        .post((request, response) => {
            const decoration = new Decoration({
                name: request.body.name,
                localization: request.body.localization,
                abbreviation: request.body.abbreviation,
                title: request.body.title
            });
            console.log(decoration);
            decoration.save((err) => {
                if(err){ console.log(err); return next(err); }
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

    router.route('/decorations/:name')

        .get((request, response) => {
            Decoration.findOne(
                {name: request.params.name, localization: request.localization},
                '-_id ' +
                'name ' +
                'localization ' +
                'abbreviation ' +
                'title ',
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

        })

        .delete((request, response) => {
            Decoration.remove({
                name: request.params.name
            }, (err) => {
                if(err){ return next(err); }
                response.json({ message: 'The requested decoration was removed.' });
                return true;
            });
        });

});