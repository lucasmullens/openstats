/*
 * GET home page.
 */
var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

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

	var key = JSON.parse(req.signedCookies.user).API_KEY;
	console.log(key);
	res.app.get('db').data.find({API_KEY:key}, function(err, data){
	// res.app.get('db').data.find({API_KEY:JSON.parse(req.signedCookies.user).API_KEY}, function(err, data){
		var tags = {};
		console.log(data);
		data.forEach(function(chunk){
			if(tags[chunk.tag] == undefined)
				tags[chunk.tag] = {
					tag:chunk.tag, 
					points:0, 
					oldest:chunk.created_at,
					newest:chunk.created_at
				}
			tags[chunk.tag].points++;
			if( chunk.created_at > tags[chunk.tag].newest )
				tags[chunk.tag].newest = chunk.created_at;
			if( chunk.created_at < tags[chunk.tag].oldest )
				tags[chunk.tag].oldest = chunk.created_at;
		});
		for(var prop in tags){
			var oldest = new Date(tags[prop].oldest);
			var newest = new Date(tags[prop].newest);

			tags[prop].newest = monthNames[newest.getMonth()] +" "+ newest.getDate() +", "+ newest.getFullYear() +" at "+ (newest.getHours()>12?newest.getHours()-12:newest.getHours()) +":"+(newest.getMinutes()<10?'0':'')+newest.getMinutes() +(newest.getHours()>12?'pm':'am');
			tags[prop].oldest = monthNames[oldest.getMonth()] +" "+ oldest.getDate() +", "+ oldest.getFullYear() +" at "+ (oldest.getHours()>12?oldest.getHours()-12:oldest.getHours()) +":"+(oldest.getMinutes()<10?'0':'')+oldest.getMinutes() +(oldest.getHours()>12?'pm':'am');
		}

		// data.forEach(function(chunk){
		// 	if(tags[chunk.tag] == undefined)
		// 		tags[chunk.tag] = new Array;
		// });
		// console.log(tags);
		res.render('page_tags', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Tags', "tags":tags }));
	});
};

exports.settings = function(req, res){
  res.render('page_settings', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Authentication', alert:req.query.m }));
};