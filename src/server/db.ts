import * as mongodb from "mongodb";
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

interface Vote {
    username: String,
    ipAddress: String
}

interface PollResponse {
    response: String,
    votes: Vote[]
}

interface Poll {
    _id?: String,
    poll_id?: Number,
    addedAt: Date,
    username: String,
    question: String,
    responses: PollResponse[]
}

export function addPoll(poll: Poll) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        getMaxId()
        .then((maxId: number) => {
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

export function getPoll(poll_id: number) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available.");
        }
        let query = {
            poll_id: Number(poll_id)
        };
        state.db.collection('polls').findOne(query)
        .then(doc => {
            console.log(doc);
            return resolve(doc);
        })
        .catch(e => reject(e));
    });
}

export function getRecentPolls() {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database not available");
        }
        state.db.collection('polls').find({}).sort({addedAt: -1}).toArray()
        .then(docs => resolve(docs))
        .catch(error => reject(error));
    });
}