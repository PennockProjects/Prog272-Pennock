var Circle = ( function() {

		// Private Data

		// Constructor
		function Circle() {
			console.log("Circle.Constructor called");
		}


		Circle.prototype.getCirc = function(radius) {
			var result = 2 * radius * Math.PI;
			console.log("Circle.getCirc: " + result);
			return (result);
		};

		return Circle;
	}());

exports.circleObj = new Circle(); 