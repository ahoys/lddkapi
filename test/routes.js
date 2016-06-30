// Base setup.
const mongoose      = require('mongoose');
const supertest     = require('supertest');
const expect        = require('expect.js');
const lodash        = require('lodash');
const should        = require('should');
const async         = require('async');
const rstr          = require('randomstring');
const config        = require('config');
const server        = supertest.agent('http://localhost:8080');

// Testable strings.
const names_ok      = config.get('UNIT_TESTS.names_ok');
const names_fail    = config.get('UNIT_TESTS.names_fail');
const pass_ok       = config.get('UNIT_TESTS.pass_ok');
const pass_fail     = config.get('UNIT_TESTS.pass_fail');
const email_ok      = config.get('UNIT_TESTS.email_ok');
const email_fail    = config.get('UNIT_TESTS.email_fail');

// Total OK for a reference.
const total_ok      = names_ok.length + pass_ok.length + email_ok.length;

// Drops database collection.
const dropDb = function () {
    // Connects to the database.
    mongoose.connect(config.get('UNIT_TESTS.url'), function () {
        mongoose.connection.db.dropDatabase();
    });
};

const addUsers = function () {
    names_ok.forEach(function (item) {
        server
            .post('/api/users')
            .send({
                name: item,
                password: pass_ok[0],
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            });
    });
    done();
};

// Actual testing starts.
describe('Routing /users', function () {

    // Launches before any of the tests.
    before(function (done) {
        dropDb();
        done();
    });

    after(function (done) {
        dropDb();
        done();
    });

    // --------------------------------------------------------------------------------------
    // POST /users, 200

    names_ok.forEach(function (item) {
        it('Should add user with proper name: ' + item, function (done) {
            var body = {
                name: item,
                password: pass_ok[0],
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

    pass_ok.forEach(function (item) {
        it('Should add user with proper password: ' + item, function (done) {
            var body = {
                name: rstr.generate({length: 6, charset: 'alphabetic'}),
                password: item,
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

    email_ok.forEach(function (item) {
        it('Should add user with proper email: ' + item, function (done) {
            var body = {
                name: rstr.generate({length: 6, charset: 'alphabetic'}),
                password: pass_ok[0],
                email: item
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

    // --------------------------------------------------------------------------------------
    // GET /users, 200

    it('Should get all users: ' + names_ok.length, function (done) {
        dropDb();
        names_ok.forEach(function (item) {
            var body = {
                name: item,
                password: pass_ok[0],
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                });
        });
        server
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if(err){
                    throw err;
                }
                should.equal(Object.keys(res.body).length, names_ok.length);
                done();
            });
    });

    // --------------------------------------------------------------------------------------
    // POST /users, 400

    names_fail.forEach(function (item) {
        it('Should not add user with an improper name: ' + item, function (done) {
            var body = {
                name: item,
                password: pass_ok[0],
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

    pass_fail.forEach(function (item) {
        it('Should not add user with an improper password: ' + item, function (done) {
            var body = {
                name: rstr.generate({length: 6, charset: 'alphabetic'}),
                password: item,
                email: rstr.generate({length: 4, charset: 'alphabetic'}) + '@test.test'
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

    email_fail.forEach(function (item) {
        it('Should not add user with an improper email: ' + item, function (done) {
            var body = {
                name: rstr.generate({length: 6, charset: 'alphabetic'}),
                password: pass_ok[0],
                email: item
            };
            server
                .post('/api/users')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if(err){
                        throw err;
                    }
                    done();
                });
        });
    });

});