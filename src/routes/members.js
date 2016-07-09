const Member    = require('../models/memberSchema');
const debug     = require('debug');
const log       = debug('Routes:Members');

module.exports = ((router) => {

    router.route('/members')

        .get((request, response) => {
            Member.find({},
                '-_id ' +
                'nickname ' +
                'email ' +
                'recruited ' +
                'memberEvents ' +
                'rank ' +
                'training ' +
                'group ' +
                'medals ' +
                'decorations ' +
                'ribbons ' +
                'meetings',
                (err, members) => {
                    if(err){
                        response.status(404).send(err);
                        return false;
                    }
                    log('GET members successful.');
                    response.json(members);
                    return true;
            });
        })

        .post((request, response) => {
            const member = new Member({
                nickname: request.body.nickname,
                email: request.body.email,
                recruited: request.body.recruited,
                memberEvents: request.body.memberEvents,
                rank: request.body.rank,
                training: request.body.training,
                group: request.body.group,
                medals: request.body.medals,
                decorations: request.body.decorations,
                ribbons: request.body.ribbons,
                meetings: request.body.meetings
            });
            member.save((err) => {
                if(err){
                    response.status(400).send(err);
                    return false;
                }
                log('POST member successful');
                response.json({ message: 'A new member added.' });
                return true;
            });
        });

    router.route('/members/:member_nickname')

        .get((request, response) => {
            Member.findOne(request.param.nickname,
                '-_id ' +
                'nickname ' +
                'email ' +
                'recruited ' +
                'memberEvents ' +
                'rank ' +
                'training ' +
                'group ' +
                'medals ' +
                'decorations ' +
                'ribbons ' +
                'meetings',
                (err, member) => {
                    if(err){
                        response.status(404).send(err);
                        return false;
                    }
                    log('GET ', member.nickname,' successful.');
                    response.json(member);
                    return true;
            });
        })

        .put((request, response) => {
            Member.findOne(request.param.nickname, (err, member) => {
                    if(err){
                        response.status(400).send(err);
                        return false;
                    }
                    member.nickname = request.body.nickname;
                    member.email = request.body.email;
                    member.recruited = request.body.recruited;
                    member.memberEvents = request.body.memberEvents;
                    member.rank = request.body.rank;
                    member.training = request.body.training;
                    member.group = request.body.group;
                    member.medals = request.body.medals;
                    member.decorations = request.body.decorations;
                    member.ribbons = request.body.ribbons;
                    member.meetings = request.body.meetings;
                    member.save((err) => {
                        if(err){
                            response.status(400).send(err);
                            return false;
                        }
                        log('PUT ', member.nickname, ' successful.');
                        response.json({ message: 'The requested member was modified.' });
                        return true;
                    });
                });
        })

        .delete((request, response) => {
            Member.remove({
                nickname: request.params.nickname
            }, (err, member) => {
                if(err){
                    response.status(404).send(err);
                    return false;
                }
                log('DELETE ', member.nickname,' successful.');
                response.json({ message: 'The requested member was removed.' });
                return true;
            });
        });
});