"use strict";
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const db = require("./db");
const api_1 = require("./api");
var app = express();
var port = 3005;
// Trust our proxy
app.enable('trust proxy');
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api', api_1.router);
app.get('/*', function (req, res) {
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
