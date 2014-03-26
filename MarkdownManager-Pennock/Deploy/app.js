/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var walkDirs = require("./Library/WalkDirs").walkDirs;
var s3Code = require("./Library/S3Code");
var fs = require("fs");
var exec = require('child_process').exec;

var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var queryMongo = require('./Library/QueryMongo').QueryMongo;
var walk = require('./Library/WalkJsObjects').walk;
var mkdirp = require('mkdirp');

function message(value) {
	'use strict';
	console.log("------------");
	console.log(value);
	console.log("------------");
}

var app = express();

// all environments
app.set('port', process.env.PORT || 30025);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Source')));
app.use(express.static(path.join(__dirname, 'Images')));
app.use(express.favicon('Images/favicon16.ico'));
// app.use(express.favicon(path.join(__dirname, 'favicon16.ico')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(request, response) {
	'use strict';
	var html = fs.readFileSync(__dirname + '/public/index.html');
	response.writeHeader(200, {
		"Content-Type" : "text/html"
	});
	response.write(html);
	response.end();
});

// app.get('/', routes.index);
// app.get('/users', user.list);

/*
 * You will need to edit one or more objects in Options.json. They have this
 * general format
 * 
 * var options = { pathToConfig: '/home/charlie/config.json', reallyWrite: true,
 * bucketName: 'bucket01.elvenware.com', folderToWalk: "Files", s3RootFolder:
 * "FilesTwo", createFolderToWalkOnS3: true, createIndex: true, filesToIgnore:
 * ['Thumbs.db', '.gitignore', 'MyFile.html'] };
 * 
 * Before filling it out, see the README file for this project.
 */

// Config Files
app.get('/getBuildConfig', function(request, response) {
	'use strict';
	console.log('getBuildConfig called');
	var options = fs.readFileSync("MarkdownTransformConfig.json", 'utf8');
	options = JSON.parse(options);
	response.send(options);
});

app.get('/getOptions', function(request, response) {
	'use strict';
	var options = fs.readFileSync("Options.json", 'utf8');
	options = JSON.parse(options);
	response.send(options);
});

var buildAll = function(response, config, index) { 'use strict';
console.log("BuildAll was called");
// var config = fs.readFileSync("MarkdownTransformConfig.json", 'utf8');	
// config = JSON.parse(config);
var command = config[index].pathToPython + " MarkdownTransform.py -i " + index;	
try {
	exec(command, function callback(error, stdout, stderr) {
		// Read in the HTML send the HTML to the client
		console.log("convertToHtml was called er: ", error);
		console.log("convertToHtml was called so: ", stdout);
		console.log("convertToHtml was called se: ", stderr);
		response.send({ "result": "Success", "data": stdout });
	});
} catch(e) {
	console.log(e.message);
	response.send( { "result" : "error", "data": e });
}
};


var buildAll = function(response, config, index) {
	'use strict';
	console.log("BuildAll was called with config: " + config + " index: " + index);
	// var config = fs.readFileSync("MarkdownTransformConfig.json", 'utf8');
	// config = JSON.parse(config);
	var contents = config;
	console.log("buildAll contents[index] = " + contents[index]);
	var command = contents[index].pathToPython + " MarkdownTransform.py -i " + index;
	console.log("buildAll command: " + command);
	try {
		exec(command, function callback(error, stdout, stderr) {
			// Read in the HTML send the HTML to the client
			console.log("convertToHtml was called er: ", error);
			console.log("convertToHtml was called so: ", stdout);
			console.log("convertToHtml was called se: ", stderr);
			response.send({
				"result" : "Success",
				"data" : stdout
			});
		});
	} catch (e) {
		console.log(e.message);
		response.send({
			"result" : "error",
			"data" : e
		});
	}
};

app.get('/buildAll', function(request, response) { 'use strict';
	var options = JSON.parse(request.query.options);
	console.log("buildAll called with options: " + JSON.stringify(options));	
	buildAll(response, options, request.query.index);
});


// File Routes
app.get('/walk', function(request, response) {
	// If you run Node in Eclipse, to access JSOBJECTS, you made need 
	// to choose Run | Run Configurations | Environment | Select
	var dirToWalk = request.query.dirToWalk || ".";
	var fileTypes = request.query.fileTypes || ['karma.conf.js', '.js'];
	var dirsToExclude = request.query.dirsToExclude || ['node_modules', 'JavaScript']; 
	
	
	// var dirToWalk = getHomeDir + '/bin';
	console.log("About to walk: " + dirToWalk);
	//               files to search, wild unknown,endswidth     // directories to skip
	walk(dirToWalk, fileTypes, dirsToExclude, function(err, data) {
		if (err) {
			console.log(err);
			response.send({
				result : "Error",
				error : err
			});
		} else {
			console.log(data);
			response.send({
				result : "Success",
				files : data
			});
		}
	});
});

var createDirectory = function(rootDir, subDir, callback, param) {
	mkdirp(rootDir + subDir, function(err) {
		if (err) {
			console.log("CreateDirectory error: " + err);
		} else {
			if(callback) {
				callback(rootDir, subDir, param);			
			}			
		}
	});	
}

var createFile = function(pathAndName, contents) {
	try {
		fs.writeFileSync(pathAndName, contents, 'utf8');										
	} catch (e) {
		console.log(e.message);
		response.send({
			"result" : "error",
			"data" : e
		});
	}	
};

app.post('/writeFiles', function(request, response) {
	var i, fileNames = [];
	var jsonObjects = request.body.jsonObjects;
	var rootDir = request.body.rootDir || __dirname;
	var subDir, fileName, contents;
	
	message("/writeFiles rootDir: '" + rootDir + "' numberOfObjects: " + jsonObjects.length);
	rootDir += "/";
	
	for(i=0; i < jsonObjects.length ; i++) {
		subDir = jsonObjects[i].subDir;
		fileName = jsonObjects[i].fileName;

		if(fileName && rootDir) {
			if(subDir) {
				createDirectory(rootDir, subDir, function(rootDir, subDir, param) {
					createFile(rootDir + subDir + "/" + jsonObjects[param].fileName, jsonObjects[param].contents);					
					console.log("/writeFiles - " + jsonObjects[param].fileName + " writeFileSync Subdir and ASYNChronously");
				}, i);
			} else {
				createFile(rootDir + jsonObjects[i].fileName, JSON.stringify(jsonObjects[i].contents, null, 4));					
				console.log("/writeFiles - " + jsonObjects[i].fileName + " writeFileSync Rootdir and SYNChronously");
			}
			fileNames.push(fileName);
		}
	}
	response.send({
		result: "Success",
		fileNames: fileNames
	})
});



//Mongo Routes
app.get('/read', function(request, response) {
	'use strict';
	console.log('read route called');
	var collectionName = request.query.collectionName;
	console.log('request.query.collectionName: ', collectionName);
	queryMongo.getCollectionData(response, collectionName);
});

app.get('/insertData', function(request, response) {
	'use strict';
	var collectionName = request.query.collectionName;
	var jsonObjects = request.query.jsonObjects;
	message('/insertData into : ' + collectionName + " with data: " + JSON.stringify(jsonObjects));
	queryMongo.insertIntoCollection(response, collectionName, jsonObjects);
});

app.get('/readCollectionFiles', function(request, response) {
	'use strict';
	var collectionName = request.query.collectionName;
	message('/readCollectionFiles collectionName: ' + collectionName);
	queryMongo.getCollectionData(response, collectionName);	
});

app.get('/insertFiles', function(request, response) {
	'use strict';
	var collectionName = request.query.collectionName;
	var fileNames = request.query.fileNames;
	var rootDir = request.query.rootDir;
	var keywords = request.query.keywords;
	
	if(fileNames) {
		message('/insertFiles collectionName: ' + collectionName + " numberOfFiles: " + fileNames.length);		
		var i, fileName, fileContents, jsonContents;
		var fs = require('fs');
		var filesCollection = [];
		
		for(var i=0; i<fileNames.length; i++) {
			var fileObject = {};
			fileObject.fileName = fileNames[i];
			fileContents = fs.readFileSync(fileObject.fileName, 'utf8');
			jsonContents = JSON.parse(fileContents);
			
			fileObject.contents = JSON.parse(fileContents);
			fileObject.rootDir = rootDir;
			fileObject.keywords = keywords;
			console.log("/insertFiles - fileName: '" + fileObject.fileName + "' with records: " + fileObject.contents.length);
			filesCollection.push(fileObject);
		}
		console.log(filesCollection);
		queryMongo.insertIntoCollection(response, collectionName, filesCollection);
	}
	response.send({
		result : "Error",
		error : "No fileNames"
	});
});

app.get('/deleteData', function(request, response) {
	'use strict';
	message('Remove called');
	queryMongo.removeAll(response, request.query.collectionName);
});

app.get('/getMongoUrls', function(request, response) {
	'use strict';
	message('/getMongoUrls called');
	queryMongo.getCollectionNames(response);
});


// S3 Routes
app.get('/listBuckets', function(request, response) {
	'use strict';
	console.log("ListBuckets called");
	console.log(request.query);
	var options = JSON.parse(request.query.options);
	console.log("ListBuckets: ", options.pathToConfig);
	s3Code.loadConfig(options.pathToConfig);
	s3Code.listBuckets(response, true);
});

app.get('/copyToS3', function(request, response) {
	'use strict';
	console.log(typeof request.query.options);
	var options = JSON.parse(request.query.options);
	console.log(options);
	walkDirs(options, response);
});



http.createServer(app).listen(app.get('port'), function() {
	'use strict';
	console.log('Express server listening on port ' + app.get('port'));
});
