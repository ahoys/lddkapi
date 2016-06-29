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

    async.each(names_ok, function (item, callback) {
        it('Should add users with proper name: ' + item, function (done) {
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
            callback();
        });
    });

    async.each(pass_ok, function (item, callback) {
        it('Should add users with proper password: ' + item, function (done) {
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
            callback();
        });
    });

    async.each(email_ok, function (item, callback) {
        it('Should add users with proper email: ' + item, function (done) {
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
            callback();
        });
    });

    it('Should get all users: ' + total_ok, function (done) {
        server
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if(err){
                    throw err;
                }
                should.equal(Object.keys(res.body).length, total_ok);
                done();
            });
    });

    async.each(names_fail, function (item, callback) {
        it('Should not add users with an improper name: ' + item, function (done) {
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
            callback();
        });
    });

    async.each(pass_fail, function (item, callback) {
        it('Should not add users with an improper password: ' + item, function (done) {
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
            callback();
        });
    });

    async.each(email_fail, function (item, callback) {
        it('Should not add users with an improper email: ' + item, function (done) {
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
            callback();
        });
    });

});