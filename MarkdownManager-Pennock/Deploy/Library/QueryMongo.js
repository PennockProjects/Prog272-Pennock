/**
 * @author Charlie Calvert and Terence Buencamino
 */

/* jshint strict:true */

var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var fs = require('fs');
var collectionList = require('./CollectionList').CollectionList;

var QueryMongo = (function() {
	'use strict';

	var database = null;
	var url = null;
	var url01 = 'mongodb://127.0.0.1:27017/test';
	var url02 = 'mongodb://192.168.2.19:27017/test';
	var url03 = 'mongodb://192.168.2.34:27017/test';
	var url04 = 'mongodb://192.168.56.101:27017/test';
	var url05 = 'mongodb://Charlie:Charles@ds033419.mongolab.com:33419/pennockprojects';

	// Constructor.
	function QueryMongo() {
		url = url05;
		console.log("Mongo DB url: " + url);
	}// End constructor

	function message(messageToShow) {
		console.log("------------");
		console.log(messageToShow);
		console.log("------------");
	}

	var getDatabase = function(response, collectionName, func) {
		console.log('Called getDatabase');
		if (database !== null) {
			console.log('database exists');
			func(response, collectionName, database);
		} else {
			console.log('Querying for database');
			MongoClient.connect(url, function(err, databaseResult) {
				if (err) {
					console.log("Error in GetDatabase");
					throw err;
				}
				database = databaseResult;
				func(response, collectionName, database);
			});
		}
		console.log("Exiting getDatabase");
	};

	QueryMongo.prototype.getCollectionNames = function(initResponse) {
		console.log("getCollectionNames called");

		var response = initResponse;
		getDatabase(response, "", function(response, collectionName, database) {
			console.log("In getCollectionNames callback: " + collectionName);
			database.collectionNames(function(error, items) {
				if (error) {
					console.log("Error in getCollectionNames: " + err);
				}
				console.log("Found collectionNames.");
				items.push({ "url": url });
				console.log(items);
				response.send(items);
			});
		});
	}

	QueryMongo.prototype.getCollectionData = function(initResponse,
			collectionName) {
		console.log("getCollectionData called on collectionName: " + collectionName);
		var response = initResponse;

		getDatabase(response, collectionName, function(response,
				collectionName, database) {
			console.log("getCollectionData->callback on: " + collectionName);

			var collection = collectionList.getCollectionByName(database,
					collectionName);

			collection.find().toArray(function(err, theArray) {
				if (err) {
					console.log("Error in getCollection: " + err);
				}
				console.log("getCollectionData->callback.find - sending back the data.");
				console.log(theArray);
				response.send(theArray);
			});

		});
	};

	// Will create collection if it does not exist
	QueryMongo.prototype.insertIntoCollection = function(response, collectionName, objectToInsert) {
		message("QueryMongo.insertIntoCollection called: " + collectionName);
		console.log(objectToInsert);
		getDatabase(response, collectionName, function(response, collectionName, database) {
			var collection = collectionList.getCollectionByName(database, collectionName);
			if (collection !== null) {
				collection.insert(objectToInsert, function(err, docs) {
					if (err) {
						throw err;
					}
					console.log("QueryMongo.insertIntoCollection insert succeeded");
					response.send({
						result : "Success",
						mongoDocument : docs
					});
				});
			} else {
				response.send({
					result : 'Could not get collection'
				});
			}
		});
	};
	
	// Will create collection if it does not exist
	QueryMongo.prototype.updateIntoCollection = function(response, collectionName, objectToUpdate) {
		message("QueryMongo.updateIntoCollection called: " + collectionName);
		console.log(objectToUpdate);
		getDatabase(response, collectionName, function(response, collectionName, database) {
			var collection = collectionList.getCollectionByName(database, collectionName);
			if (collection !== null) {
				collection.update(objectToUpdate.query, objectToInsert.update, function(err, docs) {
					if (err) {
						throw err;
					}
					console.log("QueryMongo.updateIntoCollection insert succeeded");
					response.send({
						result : "Success",
						mongoDocument : docs
					});
				});
			} else {
				response.send({
					result : 'Could not get collection'
				});
			}
		});
	};


	QueryMongo.prototype.removeAll = function(response, collectionName) {
		console.log("QueryMongo.removeAll called on " + collectionName);
		getDatabase(response, collectionName, function(response, collectionName, database) {
			var collection = collectionList.getCollectionByName(database, collectionName);
			if (collection !== null) {
				collection.remove(function(err, data) {
					if (err) {
						throw err;
					}
					console.log("Item deleted");
					response.send({
						result : "removeAll Called"
					});
				});
			}
		});
	};

	return QueryMongo;

})();

exports.QueryMongo = new QueryMongo();
