// Global abatement
var PennockProjects = PennockProjects || {};

// Modular Pattern Object
PennockProjects.PoemsView = ( function() {'use strict';
	
	// Static Private Global
	var jsonPoems = [];
	var keywords = {};
	var model;
	var currentPoemIndex = 0;
	var listPoemsIndex = 0;
	var currentKeyword = "poem";

	// Constructor
	function PoemsView(newModel) {
		// Public Instance variable
		model = newModel;
		
		// set hooks on buttons
		$("#btnInsertBardToDb").on("click", insertBardToDb);
		$("#btnDeletePoemsInDb").on("click", deletePoemsDb);
		$("#btnReadPoemsInDb").on("click", readPoemsDb);
		$("#btnInsertNewPoem").on("click", inserNewPoemToDb);

		// automatically get the Poem Data
		readPoemsDb();
		
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
	
	var inserNewPoemToDb = function() {
		disableButtons(true);
		console.log("PoemsView.inserNewPoemToDb");
		
		model.insertJson(function(data) {
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
		var keyword, keyIndex;
		console.log("PoemsView.newPoems data.length: " + data.length);
		
		// disable controls for the duration
		disableButtons(false);
		
		// clear the keywords
		keywords.length = 0;
		keywords = [];
		
		// clear keyword list
		$("#listKeywords").remove();
		$("#divKeywords").empty();
		// clear the poem list		
		$("#listPoemsByKeyword").remove();
		$("#divTitlesKeywordFiltered").empty();
		$("#divPoemControls").empty();

		// clear the displayed poem
		$("#divTitleContent").empty();
		
		// this copies the data array to the local global jsonPoems
		jsonPoems = data.slice();
		
		// If we have some poems to work with...
		if(jsonPoems.length > 0) {
			// create barebones keyword drop-down
			var listKeywords = $("<select />").attr("id", "listKeywords").addClass("poemLists");
			
			// interate through the poems
			for(var i=0 ; i < jsonPoems.length; i++) {
				// record keywords
				for(keyIndex=0; keyIndex < jsonPoems[i].keywords.length; keyIndex++) {
					// get keyword
					keyword = jsonPoems[i].keywords[keyIndex];  
					// for each keyword record the index of this poem in the keyword array
					if(keywords[keyword] === undefined) {
						// create an array once
						keywords[keyword] = [];
						// create a keyword link once					
						var linkKeyword = $("<option value='" + keyword + "'>" + keyword + "</option>");
						linkKeyword.addClass("poemLink");
						listKeywords.append(linkKeyword);
					}
					// add the index to the keyword array
					keywords[keyword].push(i);
				}
			}
			// insert keyword dropdown
			listKeywords.change(buildFilteredPoemList);
			$("#divKeywords").append(listKeywords);
			
			// trigger a change on the keyword list for 'poem'
			$("#listKeywords").val(currentKeyword).change();						
		}
		// enable controls
		disableButtons(false);
		
		// show result in the admins and console for debugging and info
		var result = "<p>Poems read: " + jsonPoems.length + " Keywords: " + Object.size(keywords) + "</p>";
		console.log(result);
		$('#divAdminResult').html(result);
	};
	
	var readError = function(jqXHR, textStatus, errorThrown) {
		var errorOut = "<p>responseText: " + jqXHR.responseText + "</p>";
		errorOut += "<p>textStatus: " + textStatus + "</p>";
		errorOut += "</p>errorThrown: " + errorThrown + "</p>";  
		console.log(errorOut);
		$('#divAdminResult').html(errorOut);		
		disableButtons(false);
	};
	
	var buildFilteredPoemList = function(event) {

		var newKeyword = event.target.value;
		
//		if((index >= 0) && (index < jsonPoems.length)) {
//		var keywordFilter=$("#listKeywords option:selected").val();

		// clear the poem list		
		$("#listPoemsByKeyword").remove();
		$("#divTitlesKeywordFiltered").empty();
			
		var poemIndexes = keywords[newKeyword];
		
		if(poemIndexes !== undefined) {
			currentKeyword = newKeyword;
			// the label
			$("#labelPoemsBy").text("by '" + currentKeyword + "'");
			
			var listPoemsByKeyword = $("<select />").attr("id", "listPoemsByKeyword").addClass("poemLists");
				
			// interate through the keyword index
			for(var i=0 ; i < poemIndexes.length; i++) {
				// create a link for each poem
				var link = $("<option value='" + poemIndexes[i] + "'>" + jsonPoems[poemIndexes[i]].title + "</option>");
				link.addClass("poemLink");
				listPoemsByKeyword.append(link);
			}
			// create hook when list changes to change poem		
			listPoemsByKeyword.change(displayPoem);
	
			// insert keyword poems dropdown
			$("#divTitlesKeywordFiltered").append(listPoemsByKeyword);
	
			// let listPoemsIndex pick up next poem on delete
			if((listPoemsIndex >= poemIndexes.length) || (listPoemsIndex < 0)) {
				listPoemsIndex = 0;
			}
			// trigger a change on the poem list
			$("#listPoemsByKeyword").val(listPoemsIndex).change();						
	
			// inform the world
			$('#divAdminResult').html("<p>'" + currentKeyword + "' list size: " + i + "</p>");
		}
	};

	// helper function
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
		
			
	var displayPoem = function(event) {
		var index = parseInt(event.target.value);
		
		$("#divPoemControls").empty();
		if((index >= 0) && (index < jsonPoems.length)) {
			currentPoemIndex = index;
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
			var btnDelete = $("<button />")
				.attr("id", "btnDelete")
				.addClass("btnAdmin")
				.append("Delete " + poem.title)
				.on("click",deletePoem);
			$("#divPoemControls").append(btnDelete);
			
			$(".aqua-card").height($("#poemSelection").height()+$("#poemDisplay").height()+$("#poemControls").height()+$("#dbControls").height()+$("#dbResult").height()+100);
		}
	};
	
	var deletePoem = function() {
		disableButtons(true);
		model.deletePoemById(jsonPoems[currentPoemIndex]._id, function() {
			$('#divTitleContent').fadeOut('slow');
			$('#divAdminResult').html("<p>poem deleted</p>");		
			console.log("Delete button callback");
			readPoemsDb();
		});
	};
	
	var disableButtons = function(isDisabled) {
		if(isDisabled) {
			$(".btnAdmin, #btnDelete, .poemLists").attr("disabled", "disabled");
		} else {
			$(".btnAdmin, #btnDelete, .poemLists").removeAttr("disabled");
		}
	};
	
	// Return constructor
	return PoemsView;
}());
