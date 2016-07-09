const Training  = require('../models/trainingSchema');
const debug     = require('debug');
const log       = debug('Routes:Training');

module.exports = ((router) => {

    router.route('/trainings')

        .get((request, response) => {
            Training.find({}, '-_id abbreviation title description', (err, trainings) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                log('GET trainings successful.');
                response.json(trainings);
                return true;
            })
        })

        .post((request, response) => {
            const training = new Training({
                abbreviation: request.body.abbreviation,
                title: request.body.title,
                description: request.body.description
            });
            training.save((err) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                log('POST training successful.');
                response.json({ message: 'A new training added.' });
                return true;
            });
        });

    router.route('/trainings/:training')

        .get((request, response) => {
            Training.findOne(request.param.training, '-_id, abbreviation title description', (err, training) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                log('GET ', training.title, ' successful.');
                response.json(training);
                return true;
            });
        })

        .put((request, response) => {
            Training.findOne(request.param.training, (err, training) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                training.abbreviation = request.body.abbreviation;
                training.title = request.body.title;
                training.description = request.body.description;
                training.save((err) => {
                    if(err){
                        response.status(400).send(err);
                        return false;
                    }
                    log('PUT ', training.title, ' successful.');
                    response.json({ message: 'The requested training was modified.' });
                    return true;
                });
            });
        })

        .delete((request, response) => {
            Training.remove({
                abbreviation: request.params.abbreviation
            }, (err, training) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                log('DELETE ', training.title, ' successful.');
                response.json({ message: 'The requested training was removed.' });
                return true;
            });
        });
});