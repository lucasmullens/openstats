
/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.send("respond with a resource");
};
exports.page_auth = function(req, res){
	res.render("auth", {error:req.query.m, nav:"Authentication"});
}

exports.service_create = function(req, res){
	try{
		req.sanitize('user_name').toString();
		req.sanitize('email').toString();
		req.sanitize('password').toString();
		req.sanitize('confirm').toString();
	}catch(e){error(res, "Please fill out all forms."); return;}
	if(req.body.user_name == undefined || req.body.email == undefined || req.body.password == undefined || req.body.confirm == undefined)
		{error(res, "Please fill out all forms."); return;}
	if(req.body.password != req.body.confirm)
		{error(res, "Passwords do not match!"); return;}
	res.app.db.users.find({email:req.body.email}, function(err, data){
		console.log(data);
	});
};

exports.login = function(req, res){
	req.sanitize('email').toString();
	req.sanitize('password').toString();
	req.app.db.users.find({email:req.body.email}, function(err, data){
		console.log(data);
	});
};

var error = function(res, message){
	res.redirect("/auth?m="+message);
}