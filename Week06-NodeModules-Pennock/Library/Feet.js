var Feet = ( function() {

	// Private Data
	var constantFeetInAMile = 5280;

	// Constructor
	function Feet() {
		console.log("Feet.Constructor called");
	}


	Feet.prototype.convertFeetToMiles = function(feet) {
		var result = feet / constantFeetInAMile;
		console.log("Feet.convertFeetToMiles: " + feet + " feet = " + result + " miles");
		return (result);
	};

	return Feet;

}());

exports.feetObj = new Feet();
