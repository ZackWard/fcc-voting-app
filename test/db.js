var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var db = require('../db.js');

before('Set up Database', function (done) {
    console.log("VOTE_APP_ENV: " + process.env.VOTE_APP_ENV);
    db.connect()
        .then(() => {done()})
        .catch((e) => {done(e)});
});

describe("Database Test 1", function () {
    it('Should show a new user form');
});

describe("Database Test 2", function () {
    it('Should create a new user');
});

describe("Database test 3", function () {
    it("Should display a login form");
});

describe("Database test 4", function () {
    it("should check login credentials and if correct, issue a token");
});