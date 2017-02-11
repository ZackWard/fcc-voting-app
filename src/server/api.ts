import * as dotenv from 'dotenv';
import * as express from "express";
import * as bodyParser from 'body-parser';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as jwt from "jsonwebtoken";
import * as db from "./db";

dotenv.config();

export const router = express.Router();
const jsonParser = bodyParser.json();

const authenticateUser = (req, res, next) => {
    
    let token: boolean | string = req.get('Authorization') == undefined ? false : req.get('Authorization');

    if ( ! token ) {
        req.APIAuthenticatedUser = false;
        return next();
    }

    // Check for a valid token
    jwt.verify(token, process.env.VOTE_APP_JWT_SECRET, function (err, payload) {
        if (err) {
            req.APIAuthenticatedUser = false;
        } else {
            req.APIAuthenticatedUser = payload.user;
        }
        next();
    });
};

const validateUser = (req, res, next) => {
    if (req.APIAuthenticatedUser == false) {
        res.status(500).json({error: "Invalid User"});
    } else {
        next();
    }
};

router.use(jsonParser);
router.use(mongoSanitize());
router.use(authenticateUser);

router.post('/register', function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    db.addUser(username, email, password)
        .then(() => {res.json({message: "User added!"})})
        .catch((e) => {res.status(500).json(e)});
});

router.get('/polls', function (req, res) {
    db.getRecentPolls(req.APIAuthenticatedUser, req.ip)
    .then((polls: any[]) => res.json(polls))
    .catch(error => res.status(500).json({error: "Error retrieving polls"}));
});

router.post('/polls', validateUser, function (req, res) {

    // Validate poll
    if (req.body.question.length < 1 || req.body.responses.length < 2) {
        return res.status(400).json({
            error: "Invalid input. A poll must have at least one question and at least two responses."
        });
    }

    let newPoll = {
        question: req.body.question,
        responses: req.body.responses,
        username: req.APIAuthenticatedUser,
        addedAt: new Date()
    };

    db.addPoll(newPoll, req.body.user, req.ip)
    .then(poll => {
        res.json({
            message: "Post added! Yippee!",
            poll: poll
        });
    })
    .catch(error => { res.status(500).json({error: "Server Error"})});
});

router.get('/polls/:poll_id', function (req, res) {
    db.getPoll(req.params.poll_id, req.APIAuthenticatedUser, req.ip)
    .then((polls: any[]) => {
        if (polls.length > 0) {
            res.json(polls);
        } else {
            res.status(404).json({
                error: "Poll not found"
            });
        }
    })
    .catch(error => res.status(500).json({
        error: "Error getting poll"
    }));
});

router.delete('/polls/:poll_id', validateUser, function (req, res) {
    console.log("Got request to delete poll #" + req.params.poll_id);
    db.deletePoll(Number(req.params.poll_id), req.APIAuthenticatedUser, req.ip)
    .then(json => res.json(json))
    .catch(error => res.status(500).json(error));
});

router.post('/polls/:poll_id/vote', function (req, res) {
    db.castVote(Number(req.params.poll_id), Number(req.body.response), req.body.newResponse, req.body.user, req.ip)
    .then(result => res.json(result))
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: error
        });
    });
});

router.get('/users/:user/polls', function (req, res) {
    db.getPollsByUser(req.params.user, req.APIAuthenticatedUser, req.ip)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({
        error: "Unable to retrieve polls for user " + req.params.user
    }));
});

router.post('/login', function (req, res) {
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
                        res.status(500).json({error: "Error setting JSON Web Token"});
                    } else {
                        res.json({apiToken: token});
                    }
                });
            } else {
                res.status(500).json({error: "Invalid credentials"});
            }
        })
        .catch(e => {res.end("Error: " + e)});
});