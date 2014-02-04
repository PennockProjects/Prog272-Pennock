describe("Week04JQuery-Pennock Jasmine Individual Tests (it) for loaddata.js", function() {
    beforeEach(function() {
		$("#test_targetp").html("contents before");
    });
    
    
	it("should loaddata.loadHTMLFragment to grab contents of test_source_fragment.html #test_div and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").text();
			var expectTarget = "Div_X1";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test_source_fragment.html", sourceIdd: "test_div", targetIdd: "test_targetp"}
		};
		
		dataTestSmash.loadHTMLFragment(mockEvent, mockCallback);

	});
	
	it("should loaddata.loadHTMLFragment to grab contents of test_source_fragment.html #test_header and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").text();
			var expectTarget = "Header_X2";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test_source_fragment.html", sourceIdd: "test_header", targetIdd: "test_targetp"}
		};
		
		dataTestSmash.loadHTMLFragment(mockEvent, mockCallback);

	});
	
	it("should loaddata.loadHTMLFragment to grab contents of test_source_fragment.html #test_paragraph and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").text();
			var expectTarget = "Paragraph_X3";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test_source_fragment.html", sourceIdd: "test_paragraph", targetIdd: "test_targetp"}
		};
		
		dataTestSmash.loadHTMLFragment(mockEvent, mockCallback);

	});
	
	
	it("should loaddata.getJsonData of 'test.json' and retrieve index 1 and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").html();
			var expectTarget = "<p>First Name: Heimer</p>"+"<p>Last Name: Schmidt</p>";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test.json", index: 1, targetIdd: "test_targetp"}
		};
		
		dataTestSmash.getJsonData(mockEvent, mockCallback);

	});
	
	it("should loaddata.getJsonData of 'test.json' and retrieve index 11 but only get index 1 and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").html();
			var expectTarget = "<p>First Name: Heimer</p>"+"<p>Last Name: Schmidt</p>";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test.json", index: 11, targetIdd: "test_targetp"}
		};
		
		dataTestSmash.getJsonData(mockEvent, mockCallback);

	});


	it("should loaddata.getJsonData of 'test.json' and retrieve index 0 and place in current html#test_targetp", function(done) {

		var dataTestSmash = new FetchData();

		var mockCallback = function() {
			var actualTarget = $("#test_targetp").html();
			var expectTarget = "<p>First Name: John</p>"+"<p>Last Name: Jingle</p>";
			expect(expectTarget).toBe(actualTarget);
			done();
		};
		var mockEvent = {
			data: {file: "test.json", index: 0, targetIdd: "test_targetp"}
		};
		
		dataTestSmash.getJsonData(mockEvent, mockCallback);

	});
});
