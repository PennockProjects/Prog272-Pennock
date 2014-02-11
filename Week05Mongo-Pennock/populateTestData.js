var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var url01 = 'mongodb://127.0.0.1:27017/test';
var url02 = 'mongodb://192.168.2.19:27017/test';

  MongoClient.connect(url01, function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_data');
    var insertArray = [];
    for (var i=10001; i<=10250; i++) {
	    insertArray.push({"firstName": "Rita"+i, "lastName": "Hill"+i, "address": i+" Ruby Street", "citystatezip": "Bellevue, WA 98002"});
    }
    
    collection.insert(insertArray, function(err, docs) {

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
