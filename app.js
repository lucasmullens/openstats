/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');
var dashboard = require('./routes/dashboard');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var databaseUrl = "database";
var collections = ["users", "data"];
var db = require("mongojs").connect(databaseUrl, collections);
var app = express();
var expressValidator = require('express-validator');
app.use(express.bodyParser());
app.use(expressValidator({}));

// all environments
app.set('db', db); 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
app.get('/', routes.index);
app.get('/dashboard', dashboard.index);
app.get('/api', api.index);
app.post('/api/track', api.track);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get("/auth", user.page_auth);
app.post("/create", user.service_create);
