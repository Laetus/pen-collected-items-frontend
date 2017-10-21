var express = require("express");
var app = express();

app.set('port', 5001);

app.use(express.static('public'))

app.listen(5001, function () {
    console.log('App listening on port 5001');
});