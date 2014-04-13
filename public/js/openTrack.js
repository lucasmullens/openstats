var OT = {domain:"http://localhost:3000/api/track"};
OT.log = function(tag, data, API_KEY, callback){
	var xmlhttp;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			typeof callback === 'function' && callback(xmlhttp.status);
		}
	}

	var params = "tag="+tag+"&data="+JSON.stringify(data)+"&API_KEY="+API_KEY;
	xmlhttp.open("POST","http://localhost:3000/api/track",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
	xmlhttp.send(params);
}
