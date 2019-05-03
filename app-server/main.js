var instatags = require('./instatags.js');

var http = require('http');
var express = require('express');
var serveStatic = require('serve-static');
var proxy = require('express-http-proxy');
var url = require('url');
var bodyParser = require('body-parser');

// Configure Web App
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configure/Init API
var router = express.Router();

router.get('/tags/related/:tag', function (req, res) {
  instatags.fetchTopSearch(req.params.tag, function (data) {
    res.json(data);
  })
});

app.use('/api', router);
app.use('/', serveStatic('./static/'));

var server = http.createServer(app).listen(3333);
console.log('Now, open http://localhost:3333');
