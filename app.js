var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/games');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', require('hogan-express'));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Setup sign in
app.use(function(req, res, next) {
  if (req.path != '/sign_in' && !req.cookies.name) {
    res.redirect('/sign_in');
  } else {
    next();
  }
});

app.use('/', routes);
app.use('/games', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Setup the in-memory database
var dbName = 'database.sqlite3';
fs.exists(dbName, function(exists) {
  if (exists) return;

  var sqlite3 = require('sqlite3');
  var db = new sqlite3.Database(dbName);

  db.run("CREATE TABLE games (id INTEGER PRIMARY KEY AUTOINCREMENT, xName TEXT, oName TEXT, data TEXT)");
  db.close();
});



module.exports = app;
