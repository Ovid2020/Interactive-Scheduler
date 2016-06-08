var http = require('http');
var fs   = require('fs');
var path = require('path');
var mime = require('mime');


var server = http.createServer(function(request, response){
	// Get the name of the resource to be served.
	var fileName;
	if (request.url == '/'){
		fileName = "./public/index.html";
	} else {
		console.log(request.url);
		fileName = "./" + request.url;
	}

	// Try opening the file.
	try {
		openFile(fileName);
	} catch (error) {
		console.log(error);
		response.writeHead(400,{'Content-Type': 'text/plain'});
		response.end("Content not found.");
	}

	function openFile(filePath){ 
		fs.exists(filePath, function(exists){ 
			if (exists){
				fs.readFile(filePath, function(err, data){
					if (err){
						serverError(404, "Resource not found.")
					} else {	
						response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))}); 
						response.end(data);	
					}
				}); 
			} else {
				serverError(404, "Resource not found.")
			}
		})																				
	}
}).listen(3000 , function(){
	console.log('Server running at ' +  3000);
});

