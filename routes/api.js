/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.send(200, {"Wat?":"Hey you, yeah, you, this route makes no sense. Go to http://openTrack.in/docs to learn more!"});
};
exports.track = function(req, res) {
	console.log(req.body.post);
    res.send(200,{"status":"success"});
};