var dbData;

var stuffForm = function(dbRecord) {
	$("#pFName").text(dbRecord.firstName);
	$("#pLName").text(dbRecord.lastName);
	$("#pAddress").text(dbRecord.address);
	$("#pCityStateZip").text(dbRecord.citystatezip);
	
};



$(document).ready(function() {

	$.getJSON('/read', function(data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			$("#mongoData").append('<li>' + JSON.stringify(data[i]) + '</li>');
		}
		dbData = data;
		
		stuffForm(dbData[$("#inputNumRec").val()-1]);
		
		$("#inputNumRec").on("change", function() {
			stuffForm(dbData[$("#inputNumRec").val()-1]);		
		});
		
		$("#btnFindRecord").on("click", function() {
			stuffForm(dbData[$("#inputNumRec").val()-1]);
		});
	});
});
