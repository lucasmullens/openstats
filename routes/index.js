/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: '' }));
};

exports.docs = function(req, res){
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Docs' }));
};

exports.get = function(req, res){
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Get' }));
};

exports.tags = function(req, res){
	if(req.signedCookies.user==undefined)
		{res.redirect("/auth?m=You need to sign in to view tags."); return;}
	res.app.get('db').data.find({API_KEY:JSON.parse(req.signedCookies.user).API_KEY}, function(err, data){
		var tags = new Array;
		data.forEach(function(chunk){
			if(tags.indexOf(chunk.tag) == -1) tags.push(chunk.tag);
		});

		// data.forEach(function(chunk){
		// 	if(tags[chunk.tag] == undefined)
		// 		tags[chunk.tag] = new Array;
		// });
		console.log(tags);
		res.render('page_tags', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Tags', "tags":tags }));
	});
};

exports.settings = function(req, res){
  res.render('page_settings', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Authentication', alert:req.query.m }));
};