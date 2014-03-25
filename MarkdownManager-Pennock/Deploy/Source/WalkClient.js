/**
 * @author John Pennock (modified from Charlie Calvert's JsObject WalkClient
 */

define(['jquery'], function() {'use strict';

	function WalkClient() {
		$("#btnWalkMDDir").on("click", {
			getDirFrom: "#copyFrom",
			fileTypes: ['.md'],
		}, walk);

		$("#btnWalkHTMLDir").on("click", { 
			getDirFrom: "#copyTo",
			fileTypes: ['.html','.htm']
		}, walk);

		$("#btnWalkHTMLDir2").on("click", { 
			getDirFrom: "#folderToWalk",
			fileTypes: ['.html', '.htm']
		}, walk);

		$("#clearResult").click(clearList);
	}
	
	var clearList = function() {
		$("#resultDiv").empty();
	};
	
	var walk = function(event) {
		if(event.data.getDirFrom) {
			event.data.dirToWalk = $(event.data.getDirFrom).val();			
		}

        $.getJSON("/walk", event.data, function(data) {
			$("#resultDiv").html('<h3>' + event.data.dirToWalk + ' for types: ' + event.data.fileTypes + '</h3><hr>');
			if(data.files) {
				for (var i = 0; i < data.files.length; i++) {
					$("#resultDiv").append(data.files[i] + '<br />');
				}
			}
		});
	};
	
	return WalkClient;
});
