var FeetConversion = (function() {
	
	// Private Data
	var constantFeetInAMile = 5280;

	// Constructor
	function FeetConversion() {
		console.log("FeetConversion.Constructor called");
	}
	
	FeetConversion.prototype.feetInAMile = function(miles) {
		console.log("FeetConversion.feetInAMile: " + constantFeetInAMile);
		return (constantFeetInAMile);
	};	
	

	FeetConversion.prototype.convertMilestoFeet = function(miles) {
		var result = miles * constantFeetInAMile;
		console.log("FeetConversion.convertMilestoFeet: " + miles + " miles = " + result);
		return (result);
	};	

	return FeetConversion;

}());

exports.feetObj = new FeetConversion();