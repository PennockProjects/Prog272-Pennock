/**
 * @author John Pennock
 */

define([ 'jquery', 'tinyPubSub' ], function() {

	var operandA, operandB;

	function calculateUI() {
		$("#btnAdd").on("click", add);
		$("#btnSubtract").on("click", subtract);
		$("#btnMultiply").on('click', multiply);
		$.subscribe('mathResult', showResult);

		$.publish('debug', {
			message : "Publisher Constructor Called"
		});
	}

	function add() {
		publishMath('add');
	}

	function subtract() {
		publishMath('subtract');
	}

	function multiply() {
		publishMath('multiply');
	}

	var publishMath = function(verb) {
		operandA = parseInt($("#inputA").val());
		operandB = parseInt($("#inputB").val());
		$.publish(verb, {
			operandA : operandA,
			operandB : operandB,
			resultPub : "mathResult"
		});
	};

	function showResult(event, resultMsg) {
		console.log(event);
		console.log(resultMsg);
		$("#pResult").html(resultMsg.result).show('slow').css({
			"text-align" : "center"
		});
	}

	return calculateUI;
});
