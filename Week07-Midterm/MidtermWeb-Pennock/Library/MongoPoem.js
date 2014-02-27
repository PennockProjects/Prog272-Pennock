var MongoPoem = ( function() {'use strict';

		// Private Data
		var MongoClient = require('mongodb').MongoClient;
		var format = require('util').format;
		var collectionName = "Poems";

		var url01 = 'mongodb://127.0.0.1:27017/test';
		var url02 = 'mongodb://http://192.168.1.104/:27017/test';
		var url05 = 'mongodb://Charlie:Charles@ds033419.mongolab.com:33419/pennockprojects';
		
		// Constructor
		function MongoPoem() {
			console.log("MongoPoem.Constructor called");
		}


		MongoPoem.prototype.InsertPoemJsonIntoMongo = function(fileName, response) {

			fileName = fileName || "Shakespeare.json";
			var fs = require('fs');
			var fileContents = fs.readFileSync(fileName, 'utf8');
			var jsonContents = JSON.parse(fileContents);
			console.log("MongoPoem.InsertPoemJsonIntoMongo file: " + fileName + " contains: " + jsonContents.length + " records");

			MongoClient.connect(url05, function(err, db) {
				if (err) {
					throw err;
				}

				var collection = db.collection(collectionName);
				collection.insert(jsonContents, function(err, docs) {

					collection.count(function(err, count) {
						console.log(format("record count in mongo = %s", count));
						db.close();
						response.send({ "err": err, "count": count});
					});
				});
			});
		};
		
		MongoPoem.prototype.deletePoemCollection = function(response) {
			console.log("MongoPoem.deletePoemCollection");
			MongoClient.connect(url05, function(err, db) {
				if (err) {
					throw err;
				}

				var collection = db.collection(collectionName);
				collection.remove(function(err) {
					if (err) {
						throw err;
					}
					db.close();
					response.send({ "result": "collection: " + collectionName + " deleted"});			
				});
			});
		};
		
		MongoPoem.prototype.readPoemCollection = function(response) {
			console.log("MongoPoem.readPoemCollection");

			MongoClient.connect(url05, function(err, database) {
				if (err) {
					throw err;
				}
				console.log('MongoPoem.readPoemCollection connect callback');
				getCollection(database, response);
			});
		};
		
		var getCollection = function(database, response) {
			
			var collection = database.collection(collectionName);
	
			// Count documents in the collection
			collection.count(function(err, count) {
				console.log(format("count = %s", count));
			});
	
			// Send the collection to the client.
			collection.find().toArray(function(err, theArray) {
		
				console.log(theArray);
				database.close();
				response.send(theArray);			
			});
		};

		return MongoPoem;
	}());

exports.mdObj = new MongoPoem();
