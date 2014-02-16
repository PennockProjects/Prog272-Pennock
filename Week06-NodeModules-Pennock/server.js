var fs = require('fs');
var feet = require('./Library/Feet');
var square = require('./Public/Square');
var calc = require('./Calc');

console.log("server.js: 5280 feet = " + feet.feetObj.convertFeetToMiles(5280));
console.log("server.js: 5 squared = " + square.squareObj.getSquare(5));
console.log("server.js: 3 + 4 = " + calc.calcObj.add(3, 4));
console.log("server.js: 3 * 4 = " + calc.calcObj.multiply(3, 4));
console.log("server.js: 3 - 4 = " + calc.calcObj.subtract(3, 4));

