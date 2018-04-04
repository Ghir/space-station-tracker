var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config.js');
const getJSON = require('get-json');
const bodyParser = require('body-parser');
const axios = require('axios');
const Sequelize = require("sequelize");
const User = require('./models').User;
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('public'));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render('home')
});

app.post('/', (req, res, next) => {
  User.create(req.body).then(user => {
    res.redirect('/tracker')
  }).catch(error => {
    console.log(error)
  })
})

app.get('/tracker', (req, res) => {
  res.locals.googleMaps_apiKey = config.googleMaps_apiKey;
  res.render('index')
});

app.get('/track', (req, res) => {
  axios.get('http://api.open-notify.org/iss-now.json')
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
      res.json({
        iss_position: { },
        message: 'failed',
        timestamp: 0
      })
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
