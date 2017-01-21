var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var db = require('../server/db.js');

before('Set up Database', function (done) {
    console.log("VOTE_APP_ENV: " + process.env.VOTE_APP_ENV);
    db.connect()
        .then(() => {done()})
        .catch((e) => {done(e)});
});

describe("GET /register", function () {
    it('Should show a new user form');
});

describe("POST /api/user", function () {
    it('Should create a new user');
});

describe("GET /login", function () {
    it("Should display a login form");
});

describe("POST /login", function () {
    it("should check login credentials and if correct, issue a token");
});