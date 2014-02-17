var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var url01 = 'mongodb://127.0.0.1:27017/test';
var url02 = 'mongodb://192.168.2.19:27017/test';

MongoClient.connect(url01, function(err, database) {
	if (err) {
		throw err;
	}

	var collection = database.collection('markdown_files');
	collection.remove(function(err) {
		if (err) {
			throw err;
		}
		database.close();
	});
	
});
