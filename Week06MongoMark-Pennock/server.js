/*
 * @author: John Pennock
 */

var express = require('express');
var app = express();
var fs = require('fs');
var mdMongo = require('./Library/CreateJson');
app.use(express.bodyParser());

var port = process.env.PORT || 30025;

app.get('/CreateMongoFromMDFile', function(request, response) {
	console.log('/CreateMongoFromMDFile called to write fileName: ' + request.query.fileName);
	mdMongo.mdObj.createMongoEntryFromMDFile(request.query.fileName);
	response.send({
		"result" : "Success"
	});
});

/* To handle a post, we have to add express.bodyParser, shown above
 Now our parameters come in on request.body */
app.post('/readMongoForMDFile', function(request, response) {
	var fileName = request.body.fileName;
	console.log('/getMDEntryFromMongo called for fileName: ' + fileName);
	console.log(request.body);

	response.send({
		"result" : "Success"
	});
});

app.get('/', function(request, response) {
	var html = fs.readFileSync(__dirname + '/Public/index.html');
	response.writeHeader(200, {
		"Content-Type" : "text/html"
	});
	response.write(html);
	response.end();
});

app.use("/", express.static(__dirname + '/Public'));
app.listen(port);
console.log('Listening on port :' + port);
