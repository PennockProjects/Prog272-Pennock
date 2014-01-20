describe("Elvenware Jasmine One Suite", function() {
  it("expects true to be true", function() {
    expect(true).toBe(true);
  });
  
  it("expects milesConvert 3 miles = ", function() {
    expect(3*5280).toBe(milesConvert.milesToFeet());
  });
  
  it("expects milesConvert 5 miles = 5*5280", function() {
  	milesConvert.miles = 5;

    expect(5*5280).toBe(milesConvert.milesToFeet());
  });
});