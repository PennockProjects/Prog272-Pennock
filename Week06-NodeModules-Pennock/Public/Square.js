var Square = ( function() {

	// Private Data

	// Constructor
	function Square() {
		console.log("Square.Constructor called");
	}


	Square.prototype.getSquare = function(wholeNum) {
		var result = wholeNum * wholeNum;
		console.log("Square.getSquare: " + wholeNum + "^2 = " + result);
		return (result);
	};

	return Square;
}());

exports.squareObj = new Square();
