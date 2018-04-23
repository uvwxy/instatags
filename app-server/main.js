var config = require('./config.js');
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
router.get('/test', function (req, res) {
  res.json({result: 'test'});
});
app.use('/api', router);


// Proxy Dev Web App if develop mode
if (config.develop) {
  console.log('proxy mode: proxying localhost:9000');
  app.use('/', proxy('http://localhost:9000', {
    forwardPath: function (req, res) {
      return url.parse(req.url).path;
    }
  }));
} else {
  app.use('/', serveStatic('../dist/'));
}

var server = http.createServer(app).listen(config.port);
console.log('Magic happens on port ' + config.port);
