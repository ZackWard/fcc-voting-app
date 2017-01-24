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