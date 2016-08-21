const log               = require('../../debug')('routes:decorations').debug;
const Decoration        = require('../models/decorationSchema');
const authController    = require('../controllers/auth');
const hasPrivilege      = require('../controllers/privileger');

module.exports = ((router) => {

    router.route('/decorations')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user)) return res.sendStatus(401);
            Decoration.find({}, '-_id id localization abbreviation title description')
                .then((decorations) => {
                    if (!decorations) {
                        res.sendStatus(404);
                    }
                    else {
                        res.header('Content-Language', req.localization);
                        res.json(decorations);
                    }
                })
                .catch((err) => {
                    log('/decorations GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .post(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('POST', req.user)) return res.sendStatus(401);
            new Decoration({
                id: req.body.id,
                localization: req.body.localization,
                abbreviation: req.body.abbreviation,
                title: req.body.title,
                description: req.body.description
            })
                .save(() => {
                    res.json({ message: 'Decoration added.' });
                })
                .catch((err) => {
                    log('/decorations POST failed.', true, err);
                    res.sendStatus(400);
                });
        });

    router.route('/decorations/:abbreviation')

        .get(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('GET', req.user)) return res.sendStatus(401);
            Decoration.findOne({
                id: req.params.id,
                localization: req.localization
            }, '-_id id localization abbreviation title description')
                .then((decoration) => {
                    if (!decoration) {
                        res.sendStatus(404);
                    }
                    else {
                        res.json(decoration);
                    }
                })
                .catch((err) => {
                    log('/decorations GET failed.', true, err);
                    res.sendStatus(400);
                });
        })

        .put(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('PUT', req.user)) return res.sendStatus(401);
            Decoration.findOne({
                id: req.params.id,
                localization: req.localization
            })
                .then((decoration) => {
                    if(!decoration){
                        res.sendStatus(404);
                    }
                    else {
                        if (req.body.localization) decoration.localization = req.body.localization;
                        if (req.body.abbreviation) decoration.abbreviation = req.body.abbreviation;
                        if (req.body.title) decoration.title = req.body.title;
                        if (req.body.description) decoration.description = req.body.description;
                        decoration.save();
                        res.json({ message: 'Decoration updated.' });
                    }
                })
                .catch((err) => {
                    log('/decorations PUT failed.', true , err);
                    res.sendStatus(400);
                })
        })

        .delete(authController.isAuthenticated, (req, res) => {
            if (!hasPrivilege('DELETE', req.user)) return res.sendStatus(401);
            Decoration.findOne({
                id: req.params.id,
                localization: req.localization
            })
                .then((decoration) => {
                    if (!decoration) {
                        res.sendStatus(404);
                    }
                    else {
                        decoration.remove();
                        res.json({ message: 'Decoration removed.' });
                    }
                })
                .catch((err) => {
                    log('/decorations DELETE failed.', true, err);
                    res.sendStatus(400);
                });
        });
});