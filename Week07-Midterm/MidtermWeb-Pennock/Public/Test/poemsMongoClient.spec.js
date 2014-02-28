/**
 * @author John Pennock
 */

describe("Mongo Client", function() {
	var mongoClient;
	
	beforeEach(function() {
		mongoClient = new PennockProjects.MongoClient();
	});

	it("Tests that insertJson is called with Sources.html", function() {
		// get is stubbed and never really called
		spyOn($, "getJSON");
		mongoClient.insertJson(function(data) {
			console.log(data);
		});
		expect($.getJSON).toHaveBeenCalledWith("newPoem.json", 	jasmine.any(Function));
	});
	
	it("Tests that deletePoemById is called with id", function() {
		// get is stubbed and never really called
		spyOn($, "get");
		mongoClient.deletePoemById(314159, function(data) {
			console.log(data);
		});
		expect($.get).toHaveBeenCalledWith('/DeletePoemById', { "id":314159}, jasmine.any(Function));
	});


	it("Integration test makes a real AJAX request", function(done) {
		mongoClient.readPoems(function(data) {
			expect(typeof data).toBe('object');
			done();
		}, function(error){
			expect("error").toBe('error');
			done();			
		});
	});

});
