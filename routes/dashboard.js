/*
 * GET home page.
 */

exports.index = function(req, res){
	var db = req.app.get('db');
	var key = "test";
	db.data.find({"API_KEY":key}).toArray( function(err,result){
		// console.log(result);
		var data = JSON.parse(result[0].data);
		var tag = result[0].tag;
		var keys = (Object.keys(data));
		// var keys = [];
		// for(var k in data) keys.push(k);
		// console.log(keys);
	  	res.render('dashboard', { "tag": tag, "keys": keys, "data": result, "nav": "" });
	});
};