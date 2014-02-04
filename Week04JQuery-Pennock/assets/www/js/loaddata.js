/**
 * @author John
 */


function FetchData() {
	this.getJsonData = function(event, callback) {
		$.getJSON(event.data.file, function(data) {
			var first, last, all;
			var index = (event.data.index > (data.length-1)) ? data.length-1 : event.data.index;
			first = "<p>First Name: " + data[index].firstName + "</p>";
			last = "<p>Last Name: " + data[index].lastName + "</p>";
			all = first + last;
			$("#"+event.data.targetIdd).html(all);
			if(callback) {
				callback(true, data);
			}
		}).success(function() {
			console.log("jpp: success loading: " + event.data.file);
		}).error(function(jqXHR, textStatus, errorThrown) {
			console.log("jpp: error loading: " + event.data.file);
		}).complete(function() {
			console.log("jpp: completed call to get: " + event.data.file);
		});	
	};
	
	this.loadHTMLFragment = function(event, callback) {
		$("#"+event.data.targetIdd).load(event.data.file + " #"+event.data.sourceIdd, function(responseText, textStatus, XMLHttpRequest) {
			  if(callback) {
			  	callback(responseText, textStatus, XMLHttpRequest);
			  }	
			  console.log( "Loaded file: " + event.data.file + " for fragment: " + event.data.sourceIdd + " and placed in: " + event.data.targetIdd );
		});
	};
	
	
}

