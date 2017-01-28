"use strict";
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const jwt = require("jsonwebtoken");
const db = require("./db");
dotenv.config();
console.log("VOTE_APP_JWT_SECRET: " + process.env.VOTE_APP_JWT_SECRET);
var app = express();
var port = 3005;
app.use(helmet());
const jsonParser = bodyParser.json();
// app.use(mongoSanitize());
app.use('/static', express.static(path.join(__dirname, '/public')));
app.post('/api/register', jsonParser, mongoSanitize(), function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    db.addUser(username, email, password)
        .then(() => { res.json({ message: "User added!" }); })
        .catch((e) => { res.status(500).json(e); });
});
app.get('/api/polls/:poll_id', jsonParser, mongoSanitize(), function (req, res) {
    db.getPoll(req.params.poll_id)
        .then(poll => res.json(poll))
        .catch(error => res.status(500).json({
        error: "Error getting poll"
    }));
});
app.post('/api/polls', jsonParser, mongoSanitize(), function (req, res) {
    console.log(req.body);
    // TODO Validate poll. There should be, at a minimum, 1 question and 2 responses.
    if (req.body.question.length < 1 || req.body.responses.length < 2) {
        return res.status(400).json({
            error: "Invalid input. A poll must have at least one question and at least two responses."
        });
    }
    // Check for a valid token
    jwt.verify(req.body.token, process.env.VOTE_APP_JWT_SECRET, function (err, payload) {
        if (err) {
            // Error, invalid token
            console.log("Invalid Token");
            res.status(401).json({
                error: "Not authorized"
            });
        }
        else {
            // Return a success message
            console.log("Valid Token for " + payload.user);
            db.addPoll({
                question: req.body.question,
                responses: req.body.responses,
                username: payload.user,
                addedAt: new Date()
            })
                .then(poll => {
                res.json({
                    message: "Post added! Yippee!",
                    pollId: poll["_id"]
                });
            })
                .catch(error => { res.status(500).json({ error: "Server Error" }); });
        }
    });
});
app.post('/api/login', jsonParser, mongoSanitize(), function (req, res) {
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
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Start the app
db.connect()
    .then(() => {
    app.listen(port, 'localhost', function () {
        console.log("Express listening on port " + port);
    });
})
    .catch((e) => {
    console.log("Error starting Voting App: " + e);
    process.exit(1);
});
