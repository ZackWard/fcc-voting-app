import * as express from 'express';
import * as helmet from 'helmet';

var app = express();
var port = 3005;

app.use(helmet());
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, 'localhost', function () {
    console.log("Express listening on port " + port);
});