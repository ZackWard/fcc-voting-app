import * as dotenv from 'dotenv';
import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as jwt from "jsonwebtoken";
import * as db from "./db";

dotenv.config();
console.log("VOTE_APP_JWT_SECRET: " + process.env.VOTE_APP_JWT_SECRET);

var app = express();
var port = 3005;

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + "/public/register.html");
});

app.post('/register', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const verifyPassword = req.body.verify_password;
    if (password !== verifyPassword) {
        res.status(400).end("Error, passwords do not match");
    } else {
        db.addUser(username, email, password)
            .then(() => {res.end("User added!")})
            .catch((e) => {res.status(500).end("Error: " + e)});
    }
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    db.verifyPassword(username, password)
        .then(success => {
            console.log("Login attempt for " + username + ": " + success);
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
                        res.end("Error setting JSON Web Token");
                    } else {
                        res.json({apiToken: token});
                    }
                });
            } else {
                res.end("Error! Cannot log in!");
            }
        })
        .catch(e => {res.end("Error: " + e)});
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