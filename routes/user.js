exports.page_auth = function(req, res){
	res.render("page_auth", {alert:req.query.m, nav:"Authentication"});
}
exports.page_activate = function(req, res){
	res.render("page_index", {nav:"Authentication", alert:"<strong>Great!</strong> Now please verify your email addres!"});
}

exports.service_create = function(req, res){
	try{
		req.sanitize('user_name').toString();
		req.sanitize('email').toString();
		req.body.email = req.body.email.toLowerCase();
		req.sanitize('password').toString();
		req.sanitize('confirm').toString();
	}catch(e){ console.error(e); error(res, "Please fill out all forms."); return;}
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
				res.cookie('user', JSON.stringify({email:req.body.email, user_name:req.body.user_name, API_KEY:GUID, password:hash}), {signed: true});
				res.redirect("/");
			});
		});
	});
};

exports.service_login = function(req, res){
	try{
		req.sanitize('email').toString();
		req.body.email = req.body.email.toLowerCase();
		req.sanitize('password').toString();
	}catch(e){error(res, "Please fill out all forms."); return;}
	console.log(req.body.password);
	if(req.body.email == undefined || req.body.password == undefined)
		{error(res, "Please fill out all forms."); return;}
	res.app.get('db').users.find({email:req.body.email}, function(err, user){
		console.log(user);
		if(err){error(res, "There was an error signing in. Please try again."); return;}
		if(user.length != 1){error(res, "Wrong email and password combination."); return;}
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
exports.service_logout = function(req, res){
	res.clearCookie('user');
	res.redirect("/");
};
exports.service_update = function(req, res){
	var user = JSON.parse(req.signedCookies.user);
	res.app.get('db').users.find({email:user.email}, function(err, users){
		if(err){settings_error(res, "There was an error updating your account. Please try again."); return;}
		if(users.length != 1){error(res, "You are not logged in."); return;}
		res.app.get("crypt").comparePassword(req.body.password, users[0].password, function(err, match){
			if(match){
				try{
					req.sanitize('user_name').toString();
					req.sanitize('email').toString();
					req.sanitize('password').toString();
					req.body.email = req.body.email.toLowerCase();
					if(req.body.new_password.length > 0)
						req.sanitize('new_password').toString();
					if(req.body.new_confirm.length > 0)
						req.sanitize('new_confirm').toString();
				}catch(e){ console.error(e); settings_error(res, "Please fill out all required forms."); return;}
				if(req.body.new_password.length > 0){
					if(req.body.new_password != req.body.new_confirm){ settings_error(res, "The new passwords do not match"); return;}
					res.app.get("crypt").cryptPassword(req.body.new_password, function(err, hash){
						if(err || hash==undefined){settings_error(res, "There was an error updating your account. Please try again."); return;}
						res.app.get('db').users.update({email: user.email, API_KEY:user.API_KEY}, {$set: {password: hash}}, function(err, updated){
							if( err || !updated ){settings_error(res, "There was an error updating your account. Please try again."); return;}
							if(req.body.user_name.length == 0 || req.body.email.length == 0)
								{settings_error(res, "Please fill out all required forms."); return;}
							res.app.get('db').users.update({email: user.email, API_KEY:user.API_KEY}, {$set: {email:req.body.email, user_name: req.body.user_name}}, function(err, updated){
								if( err || !updated ){settings_error(res, "There was an error updating your account. Please try again."); return;}
								res.clearCookie("user");
								res.app.get('db').users.find({API_KEY:user.API_KEY}, function(err, users){
									if(err || users.length != 1) {error(res, "There was an error updating your account. Please Sign in Manually."); return;}
									res.cookie('user', JSON.stringify(users[0]), {signed: true});
									res.redirect("/settings");
								});
							});
						});
					});
				}else{
					if(req.body.user_name.length == 0 || req.body.email.length == 0)
						{settings_error(res, "Please fill out all required forms."); return;}
					res.app.get('db').users.update({email: user.email, API_KEY:user.API_KEY}, {$set: {email:req.body.email, user_name: req.body.user_name}}, function(err, updated){
						if( err || !updated ){settings_error(res, "There was an error updating your account. Please try again."); return;}
						res.clearCookie("user");
						res.app.get('db').users.find({API_KEY:user.API_KEY}, function(err, users){
							if(err || users.length != 1) {error(res, "There was an error updating your account. Please Sign in Manually."); return;}
							res.cookie('user', JSON.stringify(users[0]), {signed: true});
							res.redirect("/settings");
						});
					});	
				}
			}else{
				error(res, "Incorrect password");
				return;
			}
		});
	});
}

exports.service_recycle = function(req, res){

	var GUID = guid();
	var user = JSON.parse(req.signedCookies.user);
	var oldKEY = user.API_KEY;
	lock = 0;
	res.app.get('db').users.update({API_KEY:oldKEY}, {$set: {API_KEY: GUID}}, function(err, updated){
		if(err || !updated){settings_error(res, "There was an error updating your account. Please try again."); return;}
		res.clearCookie("user");
		res.app.get('db').users.find({API_KEY:GUID}, function(err, users){
			if(err || users.length != 1) {error(res, "There was an error updating your account. Please Sign in Manually."); return;}
			res.cookie('user', JSON.stringify(users[0]), {signed: true});
			lock++;
			if(lock>=2)
				res.redirect("/settings");
		});
	});
	res.app.get('db').data.update({API_KEY:oldKEY}, {$set: {API_KEY: GUID}}, function(err, updated){
		if(err || !updated){settings_error(res, "There was an error updating your account. Please try again."); return;}
		lock++;
		if(lock>=2)
			res.redirect("/settings");
	});
};
var error = function(res, message){
	res.redirect("/auth?m="+message);
};
var settings_error = function(res, message){
	res.redirect("/settings?m="+message);
};
var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(36).substring(1);
};

var guid = function() {
    return s4() + s4() + s4() + s4();
}
