var CreateJson = ( function() {

		// Private Data
		var MongoClient = require('mongodb').MongoClient;
		var format = require('util').format;

		var url01 = 'mongodb://127.0.0.1:27017/test';
		var url02 = 'mongodb://http://192.168.1.104/:27017/test';

		// Constructor
		function CreateJson() {
			console.log("CreateJson.Constructor called");
		}


		CreateJson.prototype.createMongoEntryFromMDFile = function(fileName) {

			fileName = fileName || 'Sample.md';
			var fs = require('fs');
			var textMD = fs.readFileSync(fileName, 'utf8');
			var mongoJson = {
				"fileName": fileName,
				"markdown": textMD
			};
			console.log("CreateJson.createMongoEntryFromMDFile file: " + fileName + " contains: " + textMD);

			MongoClient.connect(url01, function(err, db) {
				if (err)
					throw err;

				var collection = db.collection('markdown_files');
				collection.insert(mongoJson, function(err, docs) {

					collection.count(function(err, count) {
						console.log(format("count = %s", count));
					});

					// Locate all the entries using find
					collection.find().toArray(function(err, results) {
						console.dir(results);
						// Let's close the db
						db.close();
					});
				});
			});

			console.log("CreateJson.createMongoEntryFromMDFile: " + fileName);
			return (mongoJson);
		};

		return CreateJson;
	}());

exports.mdObj = new CreateJson();
