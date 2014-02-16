var RouteMaster = ( function() {

		// Constructor
		function RouteMaster() {
			$("#btnGetFeeInMile").on("click", getFeet);
			$("#btnConvertFeetToMiles").on("click", getFeetToMiles);
			$("#btnConvertRadiusToCircumference").on("click", postRadiusToCirc);

			$('#divRawREADMEMD').load("README.md", function(responseText) {
				var converter = new Showdown.converter();
				$("#divREADMEMD").html(converter.makeHtml(responseText));
			});
		}

		var getFeet = function() {
			var feetToAMileResult = $('#pFeetInAMile');
			$.get('/getFeetPerMile', function(data) {
				feetToAMileResult.html("1 mile = " + data.result + " feet");
			});
		};

		var getFeetToMiles = function() {
			var feetToMilesResult = $('#pResultFeetToMiles');

			var inputData = {
				"miles" : String($("#numMiles").val())
			};
			$.get('/convertMilesToFeet', inputData, function(data) {
				feetToMilesResult.html(inputData.miles + " miles is " + data.result + " feet");
			});
		};

		var postRadiusToCirc = function() {
			var radius = $("#numRadiusMiles").val();

			$.ajax({
				url : "/getCircumference",
				type : "POST",
				data : {
					"radius" : radius
				},
				dataType : "json",
				success : function(data) {
					$("#pResultCircumference").html("A ciricle of radius: " + radius + " has a circumference of " + data.result);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.responseText);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		};

		// Return constructor
		return RouteMaster;
	}());

$(document).ready(function() {
	new RouteMaster();
});
