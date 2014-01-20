/**
 * @author John
 */
/* jshint strict: true */

console.log("It works");

var milesConvert = function(miles) {'use strict';
	var feetPerMile = 5280;
	return miles * feetPerMile;
};

console.log('Miles in feet: ' + milesConvert.milesToFeet());


