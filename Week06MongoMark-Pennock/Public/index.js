var MDMongoClient = ( function() {
	
	// Static Private Global
	var converter = new Showdown.converter();
	var html = undefined;

	// Constructor
	function MDMongoClient() {
		$("#getMDHTML").on("click", postReadMDHTML);
		$("#btnWriteMDToMongo").on("click", createMongoFromMD);
		$("#btnGetSections").on("click", getSections);

		$('#divRawREADMEMD').load("README.md", function(responseText) {
			$("#divREADMEMD").html(converter.makeHtml(responseText));
		});
	}

	var createMongoFromMD = function() {
		$.get('/CreateMongoFromMDFile', function(data) {
			$('#readMDIntoMongo').html("fileName:" + data.fileName + "\nMarkdown:" + data.markdown);
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
				console.log(data);
				$("#mdHTML").html(data.html);
				html = data.html;
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	};
	
	var getSections = function(sectionName) {
		var sections = $("#mdHTML > h3");
		var id, button;
		$("#sectionButtons").empty();
		
		for(var i=0; i< sections.length; i++) {
			id = sections[i].id;
			button = $("<button>" + sections[i].innerHTML + "</button>").attr({
				id: "btn"+id
			}).on("click", showSection);

			var section = $("#"+id, "<div>"+html+"<div>").nextUntil("h3");

			$("#sectionButtons").append(button);
			$("#btn"+id).data("section", section);
		}
	};
	
	var showSection = function(event) {
		var section = $("#"+event.currentTarget.id).data("section");
		$('#mdHTMLsection').html(section);
	};

	// Return constructor
	return MDMongoClient;
}());

$(document).ready(function() {
	new MDMongoClient();
});

