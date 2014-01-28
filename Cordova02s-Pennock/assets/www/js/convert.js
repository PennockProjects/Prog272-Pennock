/**
 * @author John
 */

var Convert = (function() {'use strict';

	// Constructor
	var Convert = function() {
	};

	Convert.prototype.fahrenheitToCelius = function(valueFahrenheit) {
		var valueCelius = (valueFahrenheit - 32) * 5 / 9;
		return valueCelius;
	};

	Convert.prototype.milesToKilometers = function(valueMiles) {
		var valueKilometers = valueMiles * 0.62137;
		return valueKilometers;
	};
	
	Convert.prototype.squareRoot = function(value) {
		var result = Math.sqrt(value);
		return result;
	};
	
	return Convert;
})();