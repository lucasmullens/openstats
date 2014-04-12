
exports.page_auth = function(req, res){
	res.render("auth", {alert:req.query.m, nav:"Authentication"});
}
exports.page_activate = function(req, res){
	res.render("page_index", {nav:"Authentication", alert:"<strong>Great!</strong> Now please verify your email addres!"});
}

exports.service_create = function(req, res){
	try{
		req.sanitize('user_name').toString();
		req.sanitize('email').toString();
		// req.sanitize('password').toString();
		// req.sanitize('confirm').toString();
	}catch(e){ console.error(e); error(res, "Please fill out all forms. -11"); return;}
	console.log(req.body);
	if(req.body.user_name == undefined || req.body.email == undefined || req.body.password == undefined || req.body.confirm == undefined)
		{error(res, "Please fill out all forms."); return;}
	if(req.body.password != req.body.confirm)
		{error(res, "Passwords do not match!"); return;}
	res.app.get('db').users.find({email:req.body.email}, function(err, data){
		if(data.length > 0)
			{error(res, "That email is already in use."); return;}
		var GUID = guid();
		res.app.get("crypt").cryptPassword(req.body.password, function(err, hash){
			console.log(hash);
			if(err){error(res, "There was an error. Please try again."); return;}
			res.app.get('db').users.save({email:req.body.email, user_name:req.body.user_name, API_KEY:GUID, password:hash}, function(err){
				if(err){error(res, "There was an error. Please try again."); return;}
				res.redirect("/activate");
			});
		});
	});
};

exports.service_login = function(req, res){
	try{
		req.sanitize('email').toString();
		// req.sanitize('password').toString();
	}catch(e){error(res, "Please fill out all forms."); return;}
	console.log(req.body.password);
	if(req.body.email == undefined || req.body.password == undefined)
		{error(res, "Please fill out all forms."); return;}
	res.app.get('db').users.find({email:req.body.email}, function(err, user){
		console.log(user);
		if(err){error(res, "There was an error signing in. Please try again"); return;}
		if(user.length != 1){error(res, "Wrong email and password combination"); return;}
		res.app.get("crypt").comparePassword(req.body.password, user[0].password, function(err, match){
			console.log(err);
			console.log(match);
			if(err || !match){error(res, "There was an error. Please try again."); return;}
			if(match){
				res.cookie('user', JSON.stringify(user[0]), {signed: true});
				res.redirect("/");
			}
		});
	});
};

var error = function(res, message){
	res.redirect("/auth?m="+message);
}
var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(36)
        .substring(1);
};

var guid = function() {
    return s4() + s4() + s4() + s4();
}