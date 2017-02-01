"use strict";
const mongodb = require("mongodb");
const validator = require("validator");
var bcrypt = require('bcrypt');
const mongo = mongodb.MongoClient;
const dbUrl = (process.env.VOTE_APP_ENV == 'test') ? 'mongodb://localhost:27017/fcc-voting-app-test' : 'mongodb://localhost:27017/fcc-voting-app';
const state = {
    db: null
};
function connect() {
    return new Promise(function (resolve, reject) {
        mongo.connect(dbUrl, function (err, db) {
            if (err) {
                return reject(err);
            }
            console.log("Connected to MongoDB: " + dbUrl);
            state.db = db;
            // Check to see if database is already set up, and do set up if we need to
            doDatabaseSetup();
            resolve();
        });
    });
}
exports.connect = connect;
function doDatabaseSetup() {
    console.log("Checking / Setting up Database");
    state.db.createIndex('users', { 'email': 1 }, { 'unique': true }).then(indexName => {
        console.log("Created index: " + indexName);
    });
    state.db.createIndex('users', { 'username': 1 }, { 'unique': true }).then(indexName => {
        console.log("Created index: " + indexName);
    });
}
function get() {
    if (state.db == null) {
        return false;
    }
    else {
        return state.db;
    }
}
exports.get = get;
function findUser(username = null, email = null) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        if (username == null && email == null) {
            return reject("You must pass either a username or an email address");
        }
        let query = {};
        if (username !== null) {
            query.username = username;
        }
        if (email !== null) {
            query.email = email;
        }
        state.db.collection('users').findOne(query)
            .then(function (doc) {
            return resolve(doc);
        })
            .catch(function (err) {
            return reject(err);
        });
    });
}
exports.findUser = findUser;
function addUser(username, email, password) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        if (username.length < 4 || email.length < 8 || password.length < 8) {
            return reject({
                error: "Invalid input"
            });
        }
        // Use bcrypt to hash the password, because storing plain text passwords is a really bad idea.
        bcrypt.hash(password, 10)
            .then((result) => {
            let userObj = {
                username: username,
                email: email,
                password: result
            };
            state.db.collection('users').insertOne(userObj, function (err, result) {
                if (err) {
                    return reject({
                        error: "Error: Username or email address already registered."
                    });
                }
                resolve(userObj);
            });
        })
            .catch((e) => { reject(e); });
    });
}
exports.addUser = addUser;
function verifyPassword(username, password) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        state.db.collection('users').findOne({ username: username })
            .then(user => bcrypt.compare(password, user.password))
            .then(correct => resolve(correct))
            .catch(e => { reject(e); });
    });
}
exports.verifyPassword = verifyPassword;
/*
 *
 * Polls
 *
*/
function addPoll(poll) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        getMaxId()
            .then((maxId) => {
            console.log("Max ID: " + maxId);
            poll.poll_id = maxId + 1;
            return state.db.collection('polls').insertOne(poll);
        })
            .then(() => resolve(poll))
            .catch(e => {
            console.log("Insertion error: " + e);
            return reject(e);
        });
    });
}
exports.addPoll = addPoll;
function getMaxId() {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        let aggregation = [
            { $group: { _id: null, max_id: { $max: "$poll_id" } }
            },
        ];
        state.db.collection('polls').aggregate(aggregation, function (err, result) {
            if (err) {
                console.log("Aggregation Error");
                return reject(err);
            }
            if (result.length == 0) {
                return resolve(0);
            }
            else {
                return resolve(Number(result[0].max_id));
            }
        });
    });
}
function getPoll(pollId) {
    return getPolls({ query: { poll_id: Number(pollId) }, limit: 1 });
}
exports.getPoll = getPoll;
function getPolls({ query = {}, sort = {}, projection = {}, limit = null, skip = 0 } = {}) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        let cursor = state.db.collection('polls').find(query);
        cursor.sort(sort);
        cursor.skip(skip);
        if (limit != null && typeof limit == "number" && limit > 0) {
            cursor.limit(limit);
        }
        cursor.project(projection);
        cursor.toArray().then(docs => resolve(docs)).catch(error => reject(error));
    });
}
exports.getPolls = getPolls;
function getRecentPolls() {
    return getPolls({ sort: { addedAt: -1 }, projection: { "_id": 0 } });
}
exports.getRecentPolls = getRecentPolls;
function hasAlreadyVoted(poll, user, ip) {
    return new Promise(function (resolve, reject) {
        if (!validator.isIP(ip)) {
            return reject("Invalid IP Address");
        }
        if (user == null && ip == null) {
            return reject("You must provide either a username or an IP Address, or both.");
        }
        state.db.collection('polls').findOne({ poll_id: Number(poll) })
            .then(doc => {
            if (doc == null) {
                return reject("Poll not found");
            }
            console.log(doc);
            let alreadyVoted = false;
            for (let i = 0; i < doc.responses.length; i++) {
                for (let j = 0; j < doc.responses[i].votes.length; j++) {
                    console.log("Comparing " + ip + " to " + doc.responses[i].votes[j].ipAddress);
                    console.log("Comparing " + user + " to " + doc.responses[i].votes[j].username);
                    if ((ip != null && doc.responses[i].votes[j].ipAddress == ip) || (user != null && doc.responses[i].votes[j].username == user)) {
                        alreadyVoted = true;
                    }
                }
            }
            resolve(alreadyVoted);
        })
            .catch(error => reject(error));
    });
}
function castVote(poll, response, user, ip) {
    user = user == undefined ? null : user;
    ip = ip == undefined ? null : ip;
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        hasAlreadyVoted(poll, user, ip)
            .then(voted => {
            if (voted) {
                console.log("Duplicate vote detected!");
                return reject("User or IP Address has already voted on this poll");
            }
            let updateOperator = {
                "$push": {}
            };
            updateOperator["$push"]["responses." + response + ".votes"] = {
                username: user,
                ipAddress: ip
            };
            console.log("Update:");
            console.log(updateOperator);
            state.db.collection('polls').updateOne({ poll_id: Number(poll) }, updateOperator, {}, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve("Matched " + result.matchedCount + " records and modified " + result.modifiedCount + " records.");
            });
        })
            .catch(error => reject(error));
    });
}
exports.castVote = castVote;
