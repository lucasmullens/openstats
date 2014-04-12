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

exports.tracks = function(req, res){
  res.render('page_tracks', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Tracks' }));
};

exports.settings = function(req, res){
  res.render('page_settings', res.app.get("mergeUser")(req.signedCookies.user, { nav: 'Authentication', alert:req.query.m }));
};