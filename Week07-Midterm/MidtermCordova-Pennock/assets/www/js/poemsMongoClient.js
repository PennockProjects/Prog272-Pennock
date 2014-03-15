// Global abatement
var PennockProjects = PennockProjects || {};

// Modular Pattern Object
PennockProjects.MongoClient = ( function() {'use strict';

	var url01 = "http://192.168.1.122:30025";
	var url02 = "";
	
	var currentUrl = url01;
	
	
	// Constructor
	function MongoClient() {
		console.log("MongoClient.constructor");
	}

	MongoClient.prototype.insertBard = function(callbackSuccessAndError) {
		console.log("MongoClient.insertBard");
		$.get(currentUrl+'/InsertShakespeareIntoMongo', function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};
	
	MongoClient.prototype.insertJson= function(callbackSuccessAndError) {
		$.getJSON(currentUrl+"/newPoem.json", function(data) {
			console.log("MongoClient.insertJson for jsonPoem: " + data);
			$.get(currentUrl+'/InsertJsonIntoMongo', { "jsonPoem": data }, function(data) {
				if(callbackSuccessAndError) {
					callbackSuccessAndError(data);
				}
			});
		});
	};

	MongoClient.prototype.deletePoems= function(callbackSuccessAndError) {
		console.log("MongoClient.deletePoems");
		$.get(currentUrl+'/DeletePoemsInMongo', function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};

	MongoClient.prototype.deletePoemById= function(id, callbackSuccessAndError) {
		console.log("MongoClient.deletePoems for id: " + id);
		$.get(currentUrl+'/DeletePoemById', { "id": id }, function(data) {
			if(callbackSuccessAndError) {
				callbackSuccessAndError(data);
			}
		});
	};


	MongoClient.prototype.readPoems = function(callbackSuccess, callbackError) {
		console.log("MongoClient.readPoems");
		$.ajax({
			url : currentUrl+"/readPoemsMongo",
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
