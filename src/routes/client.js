const Client = require('../models/clientSchema');

module.exports = ((router) => {

    router.route('/clients')

        // Save a new client
        .post((request, response) => {
            const client = new Client({
                name: request.body.name,
                secret: request.body.secret,
                user: request.user.name
            });
            console.log(client);
            // TODO: Make sure that the user exists.
            client.save((err) => {
                if(err){ console.log(err); return next(err); }
                response.json({ message: 'A new client added.' });
                return true;
            });
        });

    router.route('/decorations/:user')

        // Get all clients of an user.
        .get((request, response) => {
            Client.find({user: request.params.user},
                '-_id ' +
                'name ' +
                'secret ' +
                'user ',
                (err, clients) => {
                    if(err){ return next(err); }
                    response.json(clients);
                    return true;
                });
        });
});