// Global abatement
var PennockProjects = PennockProjects || {};

// Modular Pattern Object
PennockProjects.MongoClient = ( function() {'use strict';
	
	// Constructor
	function MongoClient() {
		console.log("MongoClient.constructor");
	}

	MongoClient.prototype.insertBard = function(callbackSuccessAndError) {
		console.log("MongoClient.insertBard");
		$.get('/InsertShakespeareIntoMongo', function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};
	
	MongoClient.prototype.insertJson= function(callbackSuccessAndError) {
		$.getJSON("newPoem.json", function(data) {
			console.log("MongoClient.insertJson for jsonPoem: " + data);
			$.get('/InsertJsonIntoMongo', { "jsonPoem": data }, function(data) {
				if(callbackSuccessAndError) {
					callbackSuccessAndError(data);
				}
			});
		});
	};

	MongoClient.prototype.deletePoems= function(callbackSuccessAndError) {
		console.log("MongoClient.deletePoems");
		$.get('/DeletePoemsInMongo', function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};

	MongoClient.prototype.deletePoemById= function(id, callbackSuccessAndError) {
		console.log("MongoClient.deletePoems for id: " + id);
		$.get('/DeletePoemById', { "id": id }, function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};


	MongoClient.prototype.readPoems = function(callbackSuccess, callbackError) {
		console.log("MongoClient.readPoems");
		$.ajax({
			url : "/readPoemsMongo",
			type : "POST",
			data : {},
			dataType : 'json',
			success : callbackSuccess,
			error : callbackError
		});
	};
	
	// Return constructor
	return MongoClient;
}());
