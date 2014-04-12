/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.signedCookies.user);
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: '' }));
};

exports.docs = function(req, res){
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Docs' }));
};

exports.get = function(req, res){
  res.render('page_index', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Get' }));
};