import * as mongodb from "mongodb";
import * as validator from "validator";
var bcrypt = require('bcrypt');

const mongo = mongodb.MongoClient;

const dbUrl = (process.env.VOTE_APP_ENV == 'test') ? 'mongodb://localhost:27017/fcc-voting-app-test' : 'mongodb://localhost:27017/fcc-voting-app';

const state = {
    db: null
};

export function connect() {
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

function doDatabaseSetup() {
    console.log("Checking / Setting up Database");
    state.db.createIndex('users', {'email': 1}, {'unique': true}).then(indexName => {
        console.log("Created index: " + indexName);
    });
    state.db.createIndex('users', {'username': 1}, {'unique': true}).then(indexName => {
        console.log("Created index: " + indexName);
    });
}

export function get() {
    if (state.db == null) {
        return false;
    } else {
        return state.db;
    }
}

export function findUser(username: string = null, email: string = null) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        if (username == null && email == null) {
            return reject("You must pass either a username or an email address");
        }

        let query: any = {};
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

export function addUser(username: string, email: string, password: string) {
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
            .catch((e) => { reject(e) });
    });
}

export function verifyPassword(username: string, password: string) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        state.db.collection('users').findOne({username: username})
            .then(user => bcrypt.compare(password, user.password))
            .then(correct => resolve(correct))
            .catch(e => {reject(e)});
    });
}

/* 
 * 
 * Polls
 * 
*/

export function addPoll(poll, user: boolean | string, ip: boolean | string) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        getMaxId()
        .then((maxId: number) => {
            poll.poll_id = maxId + 1;
            return state.db.collection('polls').insertOne(poll);
        })
        .then(() => getPoll(poll.poll_id, user, ip))
        .then(insertedPolls => resolve(insertedPolls[0]))
        .catch(e => {
            console.log("Insertion error: " + e);
            return reject(e);
        });
    });
}

function getMaxId() {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        let aggregation = [
            { $group: 
                {_id: null, max_id: {$max: "$poll_id"} } 
            },
        ];
        state.db.collection('polls').aggregate(aggregation, function (err, result) {
            if (err) {
                console.log("Aggregation Error");
                return reject(err);
            }
            if (result.length == 0) {
                return resolve(0);
            } else {
                return resolve(Number(result[0].max_id));
            }
        });
    });
}

export function getPoll(pollId: number, user, ip) {
    return getPolls({ query: {poll_id: Number(pollId)}, projection: {"_id": 0}, limit: 1, user: user, ip: ip});
}

export function getPolls({query = {}, sort = {}, projection = {"_id": 0}, limit = null, skip = 0, ip = false, user = false} = {}) {
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
        cursor.toArray()
        .then(docs => {
            let summarizedPolls = summarizePolls(docs, user, ip);
            return resolve(summarizedPolls);
        })
        .catch(error => reject(error));
    });
}

function summarizePoll(poll, user: boolean | string, ip: boolean | string) {
    let userHasVoted = false;
    poll.responses = poll.responses.map(response => {

        // Check to see if any of the votes match our user/IP
        response.votes.forEach(vote => {
            if (( user != false && user == vote.username ) || ( ip != false && ip == vote.ipAddress) ) {
                userHasVoted = true;
            }
        });

        return {
            response: response.response,
            votes: response.votes.length
        };
    });
    poll.hasVoted = userHasVoted;
    return poll;
}

function summarizePolls(polls: any[], user: boolean | string, ip: boolean | string) {
    return polls.map(poll => summarizePoll(poll, user, ip));
}

export function getRecentPolls(user, ip) {
    return getPolls({sort: {addedAt: -1}, limit: 100, user: user, ip: ip });
}

export function getPollsByUser(user: string, requestingUser, ip) {
    return getPolls({ query: {username: user}, user: requestingUser, ip: ip });
}

function hasAlreadyVoted(poll: number, user: boolean | string, ip: boolean | string) {
    return new Promise(function (resolve, reject) {
        if ( ! validator.isIP(ip)) {
            return reject("Invalid IP Address");
        }
        if (user == false && ip == false) {
            return reject("You must provide either a username or an IP Address, or both.");
        }

        state.db.collection('polls').findOne({poll_id: Number(poll)})
        .then(doc => {
            if (doc == null) {
                return reject("Poll not found");
            }
            let alreadyVoted = false;
            for (let i: number = 0; i < doc.responses.length; i++) {
                for (let j: number = 0; j < doc.responses[i].votes.length; j++) {
                    if (( ip != false && doc.responses[i].votes[j].ipAddress == ip ) || ( user != false && doc.responses[i].votes[j].username == user )) {
                        alreadyVoted = true;
                    }
                }
            }
            resolve(alreadyVoted);
        })
        .catch(error => reject(error));
    });
}

function addCustomResponse(poll: number, response: string) {
    return new Promise(function (resolve, reject) {
    
        // If there is a new response (someobody has voted for a response that wasn't already included as an option on the poll)
        // insert it here

        let newResponse = {
            response: response,
            votes: []
        };

        state.db.collection('polls').updateOne({poll_id: Number(poll)}, {"$push": {responses: newResponse}}, {}, function (err, result) {
            if (err || result.modifiedCount < 1) {
                // Something happened, we couldn't add the custom response
                return reject(err);
            }

            // Ok, we've added the new response. Now we need to pass the index of that response to the next step in the promise chain
            // to register the vote.
            state.db.collection('polls').findOne({poll_id: Number(poll)}, function (err, doc) {
                if (err) {
                    return reject(err);
                }
                
                resolve(doc.responses.length - 1);
            });
        });
    });
}

export function castVote(poll: number, response: number, newResponse: boolean | string, user: string | boolean, ip: string | boolean) {
    user = user == undefined ? false : user;
    ip = ip == undefined ? false : ip;

    // TODO: Remove this debug feature
    // Generate a random IP address so that we can test voting
    // const getRandomIpSegment = () => Math.floor(Math.random() * 254) + 1;
    // ip = getRandomIpSegment() + "." + getRandomIpSegment() + "." + getRandomIpSegment() + "." + getRandomIpSegment();
    // console.log("DEBUG: Generated fake IP: " + ip);


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
            return voted;
        })
        .then( (voted) => {
            // Check to see if the user is voting for a custom response. If so, add it, then carry on with the voting process
            if (response < 0) {
                // This is either an invalid response or a custom response
                if (typeof newResponse == 'string') {
                    // It is a custom response. Add it, then we'll carry on with the voting
                    return addCustomResponse(poll, newResponse);
                } else {
                    // Invalid response
                    return reject("There was a problem voting for your custom response");
                }
            }
            return response;
        })
        .then(responseNumber => {

            let updateOperator = {
                "$push": {}
            };
            
            let vote: any = {};
            if (user) {
                vote.username = user;
            }
            if (ip) {
                vote.ipAddress = ip;
            }

            updateOperator["$push"]["responses." + responseNumber + ".votes"] = vote;

            state.db.collection('polls').updateOne({poll_id: Number(poll)}, updateOperator, {}, function (err, result) {
                if (err) {
                    return reject(err);
                }
                state.db.collection('polls').findOne({poll_id: Number(poll)}, {fields: {"_id": 0}}, function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(summarizePoll(result, user, ip));
                });
            });
        })
        .catch(error => reject(error));
    });
}

export function deletePoll(poll: number, user: string, ip) {
    return new Promise(function (resolve, reject) {
        getPoll(poll, user, ip)
        .then(result => result[0].username == user)
        .then(isOwner => {
            if (!isOwner) {
                return reject({ error: "You do not have the authority to delete this poll." });
            } else {
                return state.db.collection('polls').deleteOne({poll_id: poll});
            }
        })
        .then(deleteResult => resolve({message: "Poll #" + poll + " deleted. Number of deleted records: " + deleteResult.deletedCount}))
        .catch(error => reject(error));
    });
}