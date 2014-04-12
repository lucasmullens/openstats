var domain = "localhost";
var tests = 0,
	successful = 0,
	failed = 0;
var http = require("http");
var get = function(path, callback){
	tests++
	var options = {
		hostname:domain,
		port:3000,
		"path":path,
		method:"GET",
		headers: {
        	accept: 'application/json'
    	}
	};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			try{
				chunk = JSON.parse(chunk);
			}catch(e){
				failed++
				console.log("GET " + path + " failed");
				console.log(e)
			}
			callback(null, chunk, path);
		});
	});

	req.on('error', function(e) {
		failed++;
		console.log("GET " + path + " failed");
		console.log(e);
	});

	req.end();
 }
var post = function(path, data, callback){
	tests++
	
	data = JSON.stringify(data);

	// prepare the header
	var postheaders = {
	    'Content-Type' : 'application/json',
	    'Content-Length' : Buffer.byteLength(data, 'utf8')
	};

	// the post options
	var optionspost = {
	    host : domain,
	    port : 3000,
	    path : path,
	    method : 'POST',
	    headers : postheaders
	};

	// do the POST call
	var reqPost = http.request(optionspost, function(res) {
	    res.on('data', function(d) {
	    	d = JSON.parse(d);
	    	callback(null, d, path);
	    });
	});

	// write the json data
	reqPost.write(data);
	reqPost.end();
	reqPost.on('error', function(e) {
	    fail(path);
	    console.error(e);
	});
}
var success = function(path){
	console.log(path+" success");
	successful++;
 }
var fail = function(path){
	console.log(path+" failed");
	failed++;
 }




//posts
post("/api/track", {"API_KEY":"asdfasdf", "tag":"gameplay", "data":{"level": 1}}, function(err, data, path){
	if(data.success == true)
		success(path);
	else
		fail(path);
 });
post("/api/track", {"API_KEY":"asdfasdf", "data":{"level": 1}}, function(err, data, path){
	if(data.success == false)
		success(path);
	else
		fail(path);
 });

setInterval(function(){
	if(successful+failed >= tests){
		console.log("success: " + successful + "/" + tests);
		console.log("fail: " + failed + "/" + tests);
		process.exit();
	}
}, 100)