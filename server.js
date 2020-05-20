'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'),
  Token = require('./api/models/tokenModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/marmeto', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'OnLeBaCkEnD', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
var routes = require('./api/routes/authRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log('server started on: ' + port);

module.exports = app;