/**
 * @author Charlie Calvert
 */

require.config({
	paths : {
		"jquery" : "http://code.jquery.com/jquery-1.11.0.min",
		"tinyPubSub" : "TinyPubSub"
	}
});

require([ "CalculateUI", "Calculate", ], function(ui, calc) {
	console.log("Main called.");
	calc();
	ui();
});
