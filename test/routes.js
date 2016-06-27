const mongoose      = require('mongoose');
const expect        = require('expect.js');
const request       = require('request');
const config        = require('config').get('API');
const should        = require('should');

describe('Routing', function() {
    var url = 'http://localhost:8080/api';
    before(function(done){
        mongoose.connect(config.get('database.url'), config.get('database.port'), config.get('database.options'));
        done();
    });
    describe('Users', function () {

        it('Should fail because of duplicate name in the database.', function(done) {
            try{
                var profile = {
                    name: 'raunhofer',
                    password: 'Esimerkki123',
                    email: 'test@test.test'
                };
                request.post(url + '/users', profile, function (err, res) {
                    if(err){
                        throw err;
                    }
                    should.equal(res.statusCode, 400);
                    done();
                });
            }catch(err){
                console.log(err);
                done();
            }
        });

        it('Should go through because of unique user.', function(done) {
            try{
                var profile = {
                    name: 'Rausku',
                    password: 'Esimerkki!123',
                    email: 'test2@test.test'
                };
                request.post(url + '/users', profile, function (err, res) {
                    if(err){
                        throw err;
                    }
                    should.equal(res.statusCode, 200);
                    done();
                });
            }catch(err){
                console.log(err);
                done();
            }
        });

    });
});