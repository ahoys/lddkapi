const supertest     = require('supertest');
const expect        = require('expect.js');
const lodash        = require('lodash');
const should        = require('should');
const async         = require('async');
const server        = supertest.agent('http://localhost:8080');

const names_ok      = ['JohnDoe', 'Rob', 'AveryLongNameThatIsTwent'];
const names_fail    = ['', 'JohnDoe7', 'Ro', 'AveryLongNameThatIsTwenty', 'Osc!ar', '<html>'];

const pass_ok       = ['MyPass7!', 'MyPass7', 'Short7', '256DNc3bFdPkr9fszPdZursxt4nv3dpmZb3DrBYrhFktQLH8nWDNAh6jnxUwRC74rBQwaK9fMx42wZBEPqUbz7KQJnWv6PHYcanQxLbGB59ncZHa5n7YwdAJNtUdXpsTcp2nMjv4JJeYH7kspPphZjAR8szDduh9F2gcLzdcnKXsWnJ2bkNrQf9U6ymwBK5Lc6B5jj4uBasD6DNW6hyUcbFTskgQVFJug4VGbyp2LVBf9Ye5ZzJDmdnEuKsZ66g2'];
const pass_fail     = ['', '<htmlScript7', 'Ab345', '1abcdef', 'Abcdef', '1ABCDEF', '1234567', '257DNc3bFdPkr9fszPdZursxt4nv3dpmZb3DrBYrhFktQLH8nWDNAh6jnxUwRC74rBQwaK9fMx42wZBEPqUbz7KQJnWv6PHYcanQxLbGB59ncZHa5n7YwdAJNtUdXpsTcp2nMjv4JJeYH7kspPphZjAR8szDduh9F2gcLzdcnKXsWnJ2bkNrQf9U6ymwBK5Lc6B5jj4uBasD6DNW6hyUcbFTskgQVFJug4VGbyp2LVBf9Ye5ZzJDmdnEuKsZ66g2a'];

const email_ok      = ['john.doe@test.com', 'a@b.c', 'a1._-e@a.a'];
const email_fail    = ['', '@a.fi', 'abcdef.fi', 'abcdefg', 'a@a', 'a@', '@', 'john<doe@test.com'];

describe('Routing', function () {

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

    async.each(names_ok, function (i1, callback1) {
        async.each(pass_ok, function (i2, callback2) {
            async.each(email_ok, function (i3, callback3) {

                it('Should post a new user.', function (done) {
                    try {
                        var body = {
                            name: i1,
                            password: i2,
                            email: i3
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

                callback3();
            });
            callback2();
        });
        callback1();
    });


});