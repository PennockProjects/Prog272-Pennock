// Global abatement
var PennockProjects = PennockProjects || {};

// Modular Pattern Object
PennockProjects.PoemsView = ( function() {'use strict';
	
	// Static Private Global
	var converter = new Showdown.converter();
	var jsonPoems = [];
	var model;
	var currentPoem = 0;

	// Constructor
	function PoemsView(newModel) {
		// Public Instance variable
		model = newModel;
		
		// set hooks on buttons
		$("#btnInsertBardToDb").on("click", insertBardToDb);
		$("#btnDeletePoemsInDb").on("click", deletePoemsDb);
		$("#btnReadPoemsInDb").on("click", readPoemsDb);

		// automatically get the Poem Data
		readPoemsDb();
		
		// load assignment via Showdown
		$('#divRawREADMEMD').load("README.md", function(responseText) {
			$("#divREADMEMD").html(converter.makeHtml(responseText));
		});
	}

	var insertBardToDb = function() {
		disableButtons(true);
		console.log("PoemsView.insertBardToDb");
		model.insertBard(function(data) {
			if(data.err === null) {
				$('#divAdminResult').html("<p>" + data.count + " poems are now in the collection 'Poems'</p>");
			} else {
				$('#divAdminResult').html("<p>Error:" + data.err + "</p>");
			}
			readPoemsDb();
			disableButtons(false);
		});
	};
	
	var deletePoemsDb = function() {
		disableButtons(true);
		console.log("PoemsView.deletePoemsDb");
		model.deletePoems(function(data) {
			$('#divAdminResult').html("<p>" + data.result + "</p>");
			readPoemsDb();
			disableButtons(false);			
		});
	};

	var readPoemsDb = function() {
		disableButtons(true);
		console.log("PoemsView.readPoemsDb");
		model.readPoems(newPoems, readError);
	};
	
	var newPoems = function(data) {
		console.log("PoemsView.newPoems number = " + data.length);
		$("#divTitles").empty();
		$("#divTitleContent").empty();
		$("#allPoemList").remove();
		// this copies the data array to the local global jsonPoems
		jsonPoems = data.slice();
		
		if(jsonPoems.length > 0) {
			var selectOptionList = $("<select />").attr("id", "allPoemList");
			// create a link for each poem
			for(var i=0 ; i < jsonPoems.length; i++) {
				var link = $("<option value='" + i + "'>" + jsonPoems[i].title + "</option>");
				link.addClass("poemLink");
				selectOptionList.append(link);
			}
			selectOptionList.change(displayPoem);
			$("#divTitles").append(selectOptionList);
			if((currentPoem >= jsonPoems.length) || (currentPoem < 0)) {
				currentPoem = 0;
			}
			$("#allPoemList").val(currentPoem).change();						
		}
		$('#divAdminResult').html("<p>Poems read: " + jsonPoems.length + "</p>");
		disableButtons(false);
	};
		
	var readError = function(jqXHR, textStatus, errorThrown) {
		var errorOut = "<p>responseText: " + jqXHR.responseText + "</p>";
		errorOut += "<p>textStatus: " + textStatus + "</p>";
		errorOut += "</p>errorThrown: " + errorThrown + "</p>";  
		console.log(errorOut);
		$('#divAdminResult').html(errorOut);		
		disableButtons(false);
	};
			
	var displayPoem = function() {
		var choice=$("#allPoemList option:selected");
		var index = choice.val();
		currentPoem = index;
		var poem = jsonPoems[index];
		var poemDisplay = "<h2>" + poem.title + " by " + poem.author + "</h2>";
		var poemFormat = poem.content.replace(/\n/g, '<br />');
		poemDisplay += "<p>" + poemFormat + "</p>";
		poemDisplay += "<br /><em>keywords</em>: ";
		for(var j=0; j < poem.keywords.length; j++) {
			poemDisplay += poem.keywords[j];
			if(j === poem.keywords.length-1) {
				poemDisplay += "<br />";
			} else {
				poemDisplay += ", ";
			}
		}
		$("#divTitleContent").html(poemDisplay).fadeIn();
		var btnDelete = $("<button />").attr("id", "btnDelete").append("Delete").on("click",deletePoem);
		$("#divTitleContent").append(btnDelete);
	};
	
	var deletePoem = function() {
		disableButtons(true);
		model.deletePoemById(jsonPoems[currentPoem]._id, function() {
			$('#divTitleContent').fadeOut('slow');
			$('#divAdminResult').html("<p>poem deleted</p>");		
			console.log("Delete button callback");
			readPoemsDb();
		});
	};
	
	var disableButtons = function(isDisabled) {
		if(isDisabled) {
			$("#btnInsertBardToDb, #btnDeletePoemsInDb, #btnReadPoemsInDb, #btnDelete, #allPoemList").attr("disabled", "disabled");
		} else {
			$("#btnInsertBardToDb, #btnDeletePoemsInDb, #btnReadPoemsInDb, #btnDelete, #allPoemList").removeAttr("disabled");
		}
	};
	
	// Return constructor
	return PoemsView;
}());
