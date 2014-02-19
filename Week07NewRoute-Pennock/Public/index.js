var MongoData = (function() { 'use strict';

	var mongoData = null;

	function MongoData() {		
		$("#readAll").click(queryAll);
		$("#readTwo").click(queryTwo);
		$("#showData").click(showData);
		$("#newRecord").on("click", queryNewRecord);
	}

	var displayRecord = function(index) {
		if((index > 0) && (index < mongoData.length)) {
			$('#firstName').html(mongoData[index].firstName);
			$('#lastName').html(mongoData[index].lastName);
			$('#address').html(mongoData[index].address);
			$('#city').html(mongoData[index].city);
			$('#state').html(mongoData[index].state);
			$('#zip').html(mongoData[index].zip);
		} 
	};

	var showData = function() {
		var index = $("#userIndex").val();
		displayRecord(index);
	};

	var queryAll = function() {
		$.getJSON('/readAll', function(data) {
			mongoData = data;
			console.log(data);
			displayRecord(0);
			$("#mongoData").empty();
			for (var i = 0; i < data.length; i++) {
				$("#mongoData").append('<li>' + JSON.stringify(data[i]) + '</li>');
			}
		});
	};

	var queryTwo = function() {
		$.getJSON('/readTwo', function(data) {
			mongoData = data;
			console.log(data);
			displayRecord(0);
			$("#mongoData").empty();
			for (var i = 0; i < data.length; i++) {
				$("#mongoData").append('<li>' + JSON.stringify(data[i]) + '</li>');
			}
		});
	};

	var queryNewRecord = function() {
		$.getJSON('/newRecord', function(data) {
			alert(data);
		});
	};

	return MongoData;
})();

$(document).ready(function() { 'use strict';
	var o = new MongoData();

});
