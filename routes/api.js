/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('api', {});
};
exports.track = function(req, res) {
	console.log(req.body);
    res.send(200,{"status":"success"});
};