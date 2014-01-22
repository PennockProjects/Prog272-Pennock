describe("Elvenware Jasmine One Suite", function() {
	it("expect to get nine", function() {
		expect(numberGetter.getNine()).toBe(9);
	});

	it("expect to get eight", function() {
		expect(numberGetter.getEight()).toBe(8);
	});
}); 