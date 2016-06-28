const supertest     = require('supertest');
const expect        = require('expect.js');
const mongoose      = require('mongoose');
const lodash        = require('lodash');
const should        = require('should');
const async         = require('async');
const server        = supertest.agent('http://localhost:8080');
const config        = require('config').get('API.database');

const names_ok      = ['JohnDoe', 'Rob', 'AveryLongNameThatIsTwent', 'myname', 'Tom', 'JackNick'];
const names_fail    = ['', 'JohnDoe7', 'Ro', 'AveryLongNameThatIsTwenty', 'Osc!ar', '<html>'];

const pass_ok       = ['MyPass7!', 'MyPass7', 'Short7', 'EsaM2!', 'mdSA!s42', '256DNc3bFdPkr9fszPdZursxt4nv3dpmZb3DrBYrhFktQLH8nWDNAh6jnxUwRC74rBQwaK9fMx42wZBEPqUbz7KQJnWv6PHYcanQxLbGB59ncZHa5n7YwdAJNtUdXpsTcp2nMjv4JJeYH7kspPphZjAR8szDduh9F2gcLzdcnKXsWnJ2bkNrQf9U6ymwBK5Lc6B5jj4uBasD6DNW6hyUcbFTskgQVFJug4VGbyp2LVBf9Ye5ZzJDmdnEuKsZ66g2'];
const pass_fail     = ['', '<htmlScript7', 'Ab345', '1abcdef', 'Abcdef', '1ABCDEF', '1234567', '257DNc3bFdPkr9fszPdZursxt4nv3dpmZb3DrBYrhFktQLH8nWDNAh6jnxUwRC74rBQwaK9fMx42wZBEPqUbz7KQJnWv6PHYcanQxLbGB59ncZHa5n7YwdAJNtUdXpsTcp2nMjv4JJeYH7kspPphZjAR8szDduh9F2gcLzdcnKXsWnJ2bkNrQf9U6ymwBK5Lc6B5jj4uBasD6DNW6hyUcbFTskgQVFJug4VGbyp2LVBf9Ye5ZzJDmdnEuKsZ66g2a'];

const email_ok      = ['john.doe@test.com', 'aa@bb.cc', 'dd@dd.dd', 'ee@test.com', 'vmdks@fa.fa', 'dd@dd.dd'];
const email_fail    = ['', '@a.fi', 'abcdef.fi', 'abcdefg', 'a@a', 'a@', '@', 'john<doe@test.com'];

describe('Routing', function () {

    const dropDb = function () {
        mongoose.connect(config.get('url'), function () {
            mongoose.connection.db.dropDatabase();
        });
    };

    before(function (done) {
        dropDb();
        done();
    });

    async.forEachOf(names_ok, function (item, key, callback) {
        it('Should add users with proper name: ' + item, function (done) {
            try {
                var body = {
                    name: item,
                    password: pass_ok[key],
                    email: email_ok[key]
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
                        should.equal(res.statusCode, 200);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

    dropDb();

    async.forEachOf(pass_ok, function (item, key, callback) {
        it('Should add users with proper password: ' + item, function (done) {
            try {
                var body = {
                    name: names_ok[key],
                    password: item,
                    email: email_ok[key]
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
                        should.equal(res.statusCode, 200);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

    dropDb();

    async.forEachOf(email_ok, function (item, key, callback) {
        it('Should add users with proper email: ' + item, function (done) {
            try {
                var body = {
                    name: names_ok[key],
                    password: pass_ok[key],
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
                        should.equal(res.statusCode, 200);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

    it('Should get all users.', function (done) {
        try {
            server
                .get('/api/users')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
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

    dropDb();

    async.forEachOf(names_fail, function (item, key, callback) {
        it('Should not add users with an improper name: ' + item, function (done) {
            try {
                var body = {
                    name: item,
                    password: pass_ok[key],
                    email: email_ok[key]
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
                        should.equal(res.statusCode, 400);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

    dropDb();

    async.forEachOf(pass_fail, function (item, key, callback) {
        it('Should not add users with an improper password: ' + item, function (done) {
            try {
                var body = {
                    name: names_ok[key],
                    password: item,
                    email: email_ok[key]
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
                        should.equal(res.statusCode, 400);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

    dropDb();

    async.forEachOf(email_fail, function (item, key, callback) {
        it('Should not add users with an improper email: ' + item, function (done) {
            try {
                var body = {
                    name: names_ok[key],
                    password: pass_ok[key],
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
                        should.equal(res.statusCode, 400);
                        done();
                    });
            }catch(err){
                console.log(err);
                done();
            }
        });
        callback();
    });

});