import * as path from 'path';
import * as express from 'express';
import * as helmet from 'helmet';
import * as db from "./db";

import { router as apiRouter } from "./api";

var app = express();
var port = 3005;

// Trust our proxy
app.enable('trust proxy');

app.use(helmet());

app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api', apiRouter);

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