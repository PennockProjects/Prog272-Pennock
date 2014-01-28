describe("Week03 Cordova02-Pennock Jasmine Individual Tests (it) for convert.js", function() {

	var testConverter = new Convert();

	it("expect freezing 32 degrees Fahrenheit to be 0 degrees Celsius", function() {
		expect(testConverter.fahrenheitToCelius(32)).toBe(0);
	});

	it("expect 1 mile to be 0.62137 kilometers", function() {
		expect(testConverter.milesToKilometers(1)).toBe(0.62137);
	});

	it("expect square root of 9 to be 3", function() {
		expect(testConverter.squareRoot(9)).toBe(3);
	});

});
