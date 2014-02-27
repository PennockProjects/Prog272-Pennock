/*
 * @author: John Pennock
 */

var express = require('express');
var app = express();
var fs = require('fs');
var mdMongo = require('./Library/MongoPoem');
app.use(express.bodyParser());

var port = process.env.PORT || 30025;

app.get('/InsertShakespeareIntoMongo', function(request, response) {'use strict';
	console.log('/InsertShakespeareIntoMongo called');
	mdMongo.mdObj.InsertPoemJsonIntoMongo("Shakespeare.json", response);
});

app.get('/DeletePoemsInMongo', function(request, response) {'use strict';
	console.log('/DeletePoemsInMongo called');
	mdMongo.mdObj.deletePoemCollection(response);
});

app.get('/DeletePoemById', function(request, response) {'use strict';
	console.log('/DeletePoemById called');
	mdMongo.mdObj.deletePoemById(request, response);
});



/* To handle a post, we have to add express.bodyParser, shown above
 Now our parameters come in on request.body */
app.post('/readPoemsMongo', function(request, response) {'use strict';
	console.log('/readPoemsMongo called.');

	mdMongo.mdObj.readPoemCollection(response);
});

app.get('/', function(request, response) {'use strict';
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
