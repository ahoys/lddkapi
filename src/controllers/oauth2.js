const log           = require('../../debug')('controllers:oauth2').debug;
const uuid          = require('uuid').v4;
const oauth2orize   = require('oauth2orize');
const Client        = require('../models/clientSchema');
const Token         = require('../models/tokenSchema');
const Code          = require('../models/codeSchema');
const server        = oauth2orize.createServer();

server.serializeClient((client, callback) => {
    log('SerializeClient triggered for ' + client.name + '.');
    return callback(null, client._id);
});

server.deserializeClient((id, callback) => {
    Client.findOne({ _id: id })
        .then((client) => {
            log('Server deserializeClient succeeded for ' + id + '.');
            return callback(null, client);
        })
        .catch((err) => {
            log('Server deserializeClient failed.', true, err);
            return callback(err);
        });
});

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, callback) => {
    new Code({ value: uuid(), clientId: client._id, redirectUri: redirectUri, userId: user._id })
        .save()
        .then((code) => {
            log('Server grant succeeded.');
            callback(null, code.value);
        })
        .catch((err) => {
            log('Server grant failed.', true, err);
            return callback(err);
        });
}));

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, callback) => {
    Code.findOne({ value: code })
        .then((authCode) => {
            if (authCode === undefined) {
                log('The authCode was undefined.');
                return callback(null, false);
            }
            else if (client._id.toString() !== authCode.clientId) {
                log('Client id mismatch (' + client._id.toString() + ') and (' + authCode.clientId + ').');
                return callback(null, false);
            }
            else if (redirectUri !== authCode.redirectUri) {
                log('RedirectUri mismatch (' + redirectUri + ') and (' + authCode.redirectUri + ').');
                return callback(null, false);
            }
            else {
                authCode.remove()
                    .then(() => {
                        new Token({ value: uuid(), clientId: authCode.clientId, userId: authCode.userId })
                            .save()
                            .then((token) => {
                                log('Server saving of a new access token succeeded.');
                                callback(null, token);
                            })
                            .catch((err) => {
                                log('Server saving for a new access token failed.', true, err);
                                callback(err);
                            });
                    })
                    .catch((err) => {
                        log('Server authCode removal failed.', true, err);
                        return callback(err);
                    });
            }

        })
        .catch((err) => {
            log('Server exchange failed.', true, err);
            return callback(err);
        });
}));

/**
 * Initializes a new authorization transaction.
 * Renders the ejs dialog.
 * @type {*[]}
 */
exports.authorization = [
    server.authorization((clientId, redirectUri, callback) => {
        Client.findOne({ id: clientId })
            .then((client) => {
                log('');
                callback(null, client, redirectUri);
            })
            .catch((err) => {
                log('', true, err);
                return callback(err);
            });
    }),
    (req, res) => {
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
];

/**
 * Handles granting the access to a account.
 * Calls server.grant(), if the access was granted.
 * @type {*[]}
 */
exports.decision = [
    server.decision()
];

/**
 * Handles requests made by the application client after granting the authorization code by the user.
 * Calls server.exchange().
 * @type {*[]}
 */
exports.token = [
    server.token(),
    server.errorHandler()
];