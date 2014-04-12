/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('api', {});
};
exports.track = function(req, res) {
	
	var db = req.app.get('db');
	var tag = req.body.tag;
	var API_KEY = req.body.API_KEY;
	var data = req.body.data;
	if (!tag) 
		res.send(200,{"success":false});
	else if (!apiKeyValid(API_KEY))
		res.send(200,{"success":false});
	else {
		db.data.save({"API_KEY": API_KEY, "tag": tag, "data": data});
    	res.send(200,{"success":true});
	}
};
var apiKeyValid = function(key){
	return true;
};