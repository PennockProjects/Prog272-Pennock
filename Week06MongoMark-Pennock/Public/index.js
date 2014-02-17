var MDMongoClient = ( function() {
	
	// Static Private Global
	var converter = new Showdown.converter();

	// Constructor
	function MDMongoClient() {
		$("#getMDHTML").on("click", postReadMDHTML);
		$("#btnWriteMDToMongo").on("click", createMongoFromMD);

		$('#divRawREADMEMD').load("README.md", function(responseText) {
			$("#divREADMEMD").html(converter.makeHtml(responseText));
		});
	}

	var createMongoFromMD = function() {
		$.get('/CreateMongoFromMDFile', function(data) {
			$('#readMDIntoMongo').text("fileName:" + data.fileName + "\nMarkdown:" + data.markdown);
		});
	};

	var postReadMDHTML = function() {
		$.ajax({
			url : "/readMongoForMDFile",
			type : "POST",
			data : {
				"fileName" : "Sample.md"
			},
			dataType : "json",
			success : function(data) {
				$("mdHTML").html(data);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	};

	// Return constructor
	return MDMongoClient;
}());

$(document).ready(function() {
	new MDMongoClient();
});

