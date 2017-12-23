var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var teacherRestRouter = require('../rest/route/teacherRestRouter');

var teacherMongodbCollection = mongoose.connect("mongodb://localhost/teacherDb");

var corsWhiteListDomains = ['http://localhost:4200'];
var corsOptionsDelegate = function(req, callback) {
    var corsOptions;
    if (corsWhiteListDomains.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

var app = express();

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/v1/teachers', teacherRestRouter);
app.use('/fdu/api/v1/teachers', teacherRestRouter);

var portNumber = 9016;
app.listen(portNumber, function() {
    console.log("REST server running on port %s", portNumber);
});