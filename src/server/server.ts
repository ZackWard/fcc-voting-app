import * as dotenv from 'dotenv';
import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as jwt from "jsonwebtoken";
import * as db from "./db";

dotenv.config();
console.log("VOTE_APP_JWT_SECRET: " + process.env.VOTE_APP_JWT_SECRET);

var app = express();
var port = 3005;

app.use(helmet());
const jsonParser = bodyParser.json();
// app.use(mongoSanitize());
app.use('/static', express.static(__dirname + '/public'));

app.post('/api/register', jsonParser, mongoSanitize(), function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    db.addUser(username, email, password)
        .then(() => {res.json({message: "User added!"})})
        .catch((e) => {res.status(500).json(e)});
});

app.post('/api/poll', jsonParser, mongoSanitize(), function (req, res) {
    console.log(req.body);
    res.json({
        message: "Post added! Yippee!"
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

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

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