var Calc = ( function() {
	// Private Data

	// Constructor
	function Calc() {
		console.log("Calc.Constructor called");
	}


	Calc.prototype.add = function(operandA, operandB) {
		var result = operandA + operandB;
		console.log("Calc.add: " + operandA + " + " + operandB + " = " + result);
		return (result);
	};

	Calc.prototype.multiply = function(operandA, operandB) {
		var result = operandA * operandB;
		console.log("Calc.multiply: " + operandA + " * " + operandB + " = " + result);
		return (result);
	};

	Calc.prototype.subtract = function(operandA, operandB) {
		var result = operandA - operandB;
		console.log("Calc.subtract: " + operandA + " - " + operandB + " = " + result);
		return (result);
	};

	return Calc;
}());

exports.calcObj = new Calc();
