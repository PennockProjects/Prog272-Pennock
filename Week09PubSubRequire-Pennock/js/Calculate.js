/**
 * @author John Pennock
 */

// create the global object
var PubSub = {};

define([ 'jquery', 'tinyPubSub' ], function() {

	function calculate() {
		$.subscribe('add', addMath);
		$.subscribe('subtract', subMath);
		$.subscribe('multiply', timesMath);
	}

	function addMath(event, mathMessage) {
		console.log(event);
		console.log(mathMessage);
		var result = mathMessage.operandA + mathMessage.operandB;
		$.publish(mathMessage.resultPub, {
			result : result
		});
	}

	function subMath(event, mathMessage) {
		console.log(event);
		console.log(mathMessage);
		var result = mathMessage.operandA - mathMessage.operandB;
		$.publish(mathMessage.resultPub, {
			result : result
		});
	}

	function timesMath(event, mathMessage) {
		console.log(event);
		console.log(mathMessage);
		var result = mathMessage.operandA * mathMessage.operandB;
		$.publish(mathMessage.resultPub, {
			result : result
		});
	}

	return calculate;
});
