/**
 * @author John Pennock - jasmine-node
 */

var request = require('request');

describe("A Mongo Suite", function() { 'use strict';

	var server = 'http://localhost:30025/';
	
	beforeEach(function() {
		
	});

	it("should deletePoemCollection a JSON document", function(done) {
		request("http://localhost:30025/DeletePoemsInMongo", function(error, response, output) {
			console.log("/DeletePoemsInMongo called: " + output);
			var output = JSON.parse(output);
			expect(output.result).toBe("collection: Poems deleted");
			done();
		});
	});
	
	it("should insertIntoCollection a JSON document", function(done) {
		request("http://localhost:30025/InsertShakespeareIntoMongo", function(error, response, output) {
			console.log("/InsertShakespeareIntoMongo called: " + output);
			var output = JSON.parse(output);
			expect(output.count).toBe(154);
			done();
		});
	});
	
	
	it("should call /InsertJsonIntoMongo and insert a json poem", function(done) {
		var poem = [{
		   "title":"title",
		   "author": "author",
		   "keywords": ["key1", "key2"],
		   "content": "content"
		}];

		request("http://localhost:30025/InsertJsonIntoMongo?jsonPoem="+poem, function(error, response, output) {
			console.log("/InsertJsonIntoMongo called: " + output);
			var output = JSON.parse(output);			
			expect(output.count).toBe(155);
			done();
		});
	});
}); 
