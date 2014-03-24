/**
 * @author Charlie Calvert
 */

require.config({
  paths: {
    "jquery": "http://code.jquery.com/jquery-1.11.0.min",
    "awsui": "AwsUi",
    "WalkClient": "WalkClient"
  }
});

require(["awsui", "WalkClient"], function(awsui, walk) { 'use strict';
	console.log("Main called.");
	awsui();
	walk();
});
