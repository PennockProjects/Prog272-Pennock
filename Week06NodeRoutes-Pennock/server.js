var express = require('express');
var app = express();
var fs = require('fs');
var circle = require('./Library/Circle');
var feetConvert = require('./Library/FeetConversion');
app.use(express.bodyParser());

var port = process.env.PORT || 30025;

app.get('/getFeetPerMile', function(request, response) {
	console.log('/getFeetPerMile called, returning: ' + feetConvert.feetObj.feetInAMile());
	response.send({ "result": feetConvert.feetObj.feetInAMile() });
});

// With a get, the parameters are passed in request.query
app.get('/convertMilesToFeet', function(request, response) {
	console.log('/convertMilesToFeet ' + request.query.miles);	
	var feet = feetConvert.feetObj.convertMilestoFeet(request.query.miles);
	response.send({ "result": feet });
});

/* To handle a post, we have to add express.bodyParser, shown above
   Now our parameters come in on request.body */
app.post('/getCircumference', function(request, response) {
	console.log('/getCircumference called');	
	console.log(request.body);	
	var radius = parseInt(request.body.radius);
	var result = circle.circleObj.getCirc(radius);
	response.send({ "result": result });
});

app.get('/', function(request, response) {
	var html = fs.readFileSync(__dirname + '/Public/index.html');
	response.writeHeader(200, {"Content-Type": "text/html"});   
	response.write(html);
	response.end();
});


app.use("/", express.static(__dirname + '/Public'));
app.listen(port);
console.log('Listening on port :' + port);
