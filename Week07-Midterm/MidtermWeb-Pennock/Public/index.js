var MongoClient = ( function() {'use strict';
	
	// Static Private Global
	var converter = new Showdown.converter();
	var jsonPoems = [];

	// Constructor
	function MongoClient() {
		$("#btnInsertBardToMongo").on("click", insertBardToMongo);
		$("#btnDeletePoemsInMongo").on("click", deletePoemsMongo);
		$("#btnReadPoemsInMongo").on("click", readPoemsMongo);

		$('#divRawREADMEMD').load("README.md", function(responseText) {
			$("#divREADMEMD").html(converter.makeHtml(responseText));
			readPoemsMongo();
		});
	}

	var insertBardToMongo = function() {
		disableButtons(true);
		console.log("MongoClient.insertBardToMongo");
		$.get('/InsertShakespeareIntoMongo', function(data) {
			if(data.err === null) {
				$('#divResultBardInsert').html(data.count + " poems are now in the collection 'Poems'");
			} else {
				$('#divResultBardInsert').html("Error:" + data.err);
			}
			readPoemsMongo();
			disableButtons(false);
		});
	};
	
	var deletePoemsMongo= function() {
		disableButtons(true);
		console.log("MongoClient.deletePoemsMongo");
		$.get('/DeletePoemsInMongo', function(data) {
			$('#divResultBardInsert').html(data.result);
			readPoemsMongo();
			disableButtons(false);
		});
	};


	var readPoemsMongo = function() {
		disableButtons(true);
		$.ajax({
			url : "/readPoemsMongo",
			type : "POST",
			data : {},
			dataType : 'json',
			success : function(data) {
				console.log(data);
				jsonPoems = data.slice();
				for(var i=0 ; i < jsonPoems.length; i++) {
					var link = $("<a href='#'>" + jsonPoems[i].title + "</a>");
					link.addClass("poemLink");
					link.data('index', i);
					link.on("click", onClickDisplayPoem);
					$("#divTitles").append(link);
				}
				disableButtons(false);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				disableButtons(false);
				console.log(jqXHR.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	};
	
	var onClickDisplayPoem = function() {
		var index=$(this).data('index');
		var poem = jsonPoems[index];
		var poemDisplay = "<h2>" + poem.title + " by " + poem.author + "</h2>";
		poemDisplay += "<em>keywords</em>: ";
		for(var j=0; j < poem.keywords.length; j++) {
			poemDisplay += poem.keywords[j];
			if(j === poem.keywords.length-1) {
				poemDisplay += "<br />";
			} else {
				poemDisplay += ", ";
			}
		}
		var poemFormat = poem.content.replace(/\n/g, '<br />');
		poemDisplay += "<p>" + poemFormat + "</p>";
		$("#divTitleContent").html(poemDisplay);					
	};
	
	var disableButtons = function(isDisabled) {
		if(isDisabled) {
			$("#btnInsertBardToMongo, #btnDeletePoemsInMongo, #btnReadPoemsInMongo").attr("disabled", "disabled");
		} else {
			$("#btnInsertBardToMongo, #btnDeletePoemsInMongo, #btnReadPoemsInMongo").removeAttr("disabled");
		}
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
	return MongoClient;
}());

$(document).ready(function() {'use strict';
	new MongoClient();
});

