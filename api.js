"use strict";
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const jwt = require("jsonwebtoken");
const db = require("./db");
dotenv.config();
exports.router = express.Router();
const jsonParser = bodyParser.json();
const authenticateUser = (req, res, next) => {
    let token = false;
    if (req.method.toLowerCase() == "get") {
        token = req.query.token;
    }
    else if (req.method.toLowerCase() == "post") {
        token = req.body.token;
    }
    console.log("In authenticateUser");
    console.log("Token: " + token);
    if (!token) {
        req.APIAuthenticatedUser = false;
        return next();
    }
    // Check for a valid token
    jwt.verify(token, process.env.VOTE_APP_JWT_SECRET, function (err, payload) {
        if (err) {
            req.APIAuthenticatedUser = false;
        }
        else {
            req.APIAuthenticatedUser = payload.user;
        }
        next();
    });
};
const validateUser = (req, res, next) => {
    if (req.APIAuthenticatedUser == false) {
        res.status(500).json({ error: "Invalid User" });
    }
    else {
        next();
    }
};
exports.router.use(jsonParser);
exports.router.use(mongoSanitize());
exports.router.use(authenticateUser);
exports.router.post('/register', function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    db.addUser(username, email, password)
        .then(() => { res.json({ message: "User added!" }); })
        .catch((e) => { res.status(500).json(e); });
});
exports.router.get('/polls', function (req, res) {
    db.getRecentPolls(req.APIAuthenticatedUser, req.ip)
        .then((polls) => res.json(polls))
        .catch(error => res.status(500).json({ error: "Error retrieving polls" }));
});
exports.router.post('/polls', validateUser, function (req, res) {
    // Validate poll
    if (req.body.question.length < 1 || req.body.responses.length < 2) {
        return res.status(400).json({
            error: "Invalid input. A poll must have at least one question and at least two responses."
        });
    }
    db.addPoll({
        question: req.body.question,
        responses: req.body.responses,
        username: req.APIAuthenticatedUser,
        addedAt: new Date()
    })
        .then(poll => {
        res.json({
            message: "Post added! Yippee!",
            pollId: poll["_id"]
        });
    })
        .catch(error => { res.status(500).json({ error: "Server Error" }); });
});
exports.router.get('/polls/:poll_id', function (req, res) {
    db.getPoll(req.params.poll_id)
        .then((polls) => {
        if (polls.length > 0) {
            res.json(polls);
        }
        else {
            res.status(404).json({
                error: "Poll not found"
            });
        }
    })
        .catch(error => res.status(500).json({
        error: "Error getting poll"
    }));
});
exports.router.post('/polls/:poll_id/vote', function (req, res) {
    console.log("Casting vote for response #" + req.body.response + " on poll #" + req.params.poll_id);
    console.log("Request from: " + req.ip);
    db.castVote(Number(req.params.poll_id), Number(req.body.response), req.body.user, req.ip)
        .then(result => res.json(result))
        .catch(error => {
        console.log(error);
        res.status(500).json({
            message: error
        });
    });
});
exports.router.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    db.verifyPassword(username, password)
        .then(success => {
        if (success) {
            // Set JSON Web Token for future API authentication
            let payload = {
                user: username
            };
            let jwtOptions = {
                expiresIn: "7d"
            };
            jwt.sign(payload, process.env.VOTE_APP_JWT_SECRET, jwtOptions, function (err, token) {
                if (err) {
                    res.status(500).json({ error: "Error setting JSON Web Token" });
                }
                else {
                    res.json({ apiToken: token });
                }
            });
        }
        else {
            res.status(500).json({ error: "Invalid credentials" });
        }
    })
        .catch(e => { res.end("Error: " + e); });
});
