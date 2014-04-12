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
var bcrypt = require('bcrypt-nodejs');
//encrypt password -> callback(err, hash)
var crypt = {};
crypt.cryptPassword = function (password, callback) {
   bcrypt.genSalt(10, function (err, salt) {
	if (err) return callback(err);
	  else {
		bcrypt.hash(password, salt, null, function (err, hash) {
			return callback(err, hash);
		});
	  }
  });
 };
//decript password -> callback(bool matches)
crypt.comparePassword = function (password, hash, callback) {
   bcrypt.compare(password, hash, function (err, isPasswordMatch) {
	  if (err) return callback(err);
	  else return callback(null, isPasswordMatch);
   });
 };
//merge user object into render object
var mergeUser = function(user, renderObj){
	if(typeof user == 'string') user = JSON.parse(user);
	if(typeof user == 'object'){
		var returnObj = {"user":user};
		for (var attrname in renderObj) { returnObj[attrname] = renderObj[attrname]; }
		return returnObj;
	}
	return renderObj;
 }
var app = express();
var expressValidator = require('express-validator');
app.use(express.bodyParser());
app.use(expressValidator({}));
//cookies//////////////////////////////////////////////////////////////////////////////////
app.use(express.cookieParser('trackingshit'));
app.use(express.session({secret: 'shittracking'}));
// all environments
app.set('db', db); 
app.set('crypt', crypt); 
app.set('mergeUser', mergeUser); 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon("public/img/favicon.png"));
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
app.get('/dashboard/:tag', function(req,res){
	var db = req.app.get('db');
	var key = "test";
	var tag = req.params.tag;
	db.data.find({"API_KEY":key, "tag":tag}).toArray( function(err,result){
		var data = JSON.parse(result[0].data);
		var keys = (Object.keys(data));
	  	res.render('dashboard', { "tag": tag, "keys": keys, "data": result, "nav": "" });
	});
});
app.get('/docs', routes.docs);
app.get('/get', routes.get);
app.get('/tags', routes.tags);
app.get('/settings', routes.settings);


app.get('/api', api.index);
app.post('/api/track', api.track);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get("/auth", user.page_auth);
app.post("/create", user.service_create);
app.get("/activate", user.page_activate);
app.post("/create", user.service_create);
app.post("/login", user.service_login);
app.post("/update", user.service_update);
app.post("/recycle", user.service_recycle);
app.get("/logout", user.service_logout);
