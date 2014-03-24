define(['jquery'], function() {'use strict';

    var buttons = null;
    var options = null;
    var transformOptions = null;
    var dataIndex = 0;
    var dataIndexTransform = 0;
    var endUrl;
	var collections = ['configFiles', 'poems'];

    function AwsUi() {
    	$("#readFileConfigs").on("click", getFileConfigs );
    	$("#readConfigs").on("click", readDBConfigs);
        $("#insertConfigs").on("click", insertConfigs)
    	
        $("#listBuckets").click(listBuckets);
        $("#copyToS3").click(copyToS3);
        $("#getOptions").click(getOptions);
        $("#transformForwardButton").click(forwardTransform);
        $("#tranformBackButton").click(backwardTransform);
        $("#forwardButton").click(forward);
        $("#backButton").click(backward);

        $("#buildAll").click(buildAll);
        listMongoCollections("<h4>Mongo URL and Collections</h4>");
        getFileConfigs();
    }
    
    // Config Functions
    var getFileConfigs = function() {
        getBuildConfig();
        getOptions();
        setupUI();    	
    };
    
    var getBuildConfig = function() {
        $.getJSON("/getBuildConfig", function(optionsInit) {
            transformOptions = optionsInit;
            displayTransformConfig(transformOptions[dataIndexTransform]);
        }).fail(function(a) {
        	if(confirm("Error retrieving MarkdownTransformConfig.json.  Would you like to try retrieving from the database?")) {
        		readDBConfigs();
        	}
//            alert(JSON.stringify(a));
        });
    };
    
    var getOptions = function() {
        $.getJSON("/getOptions", function(optionsInit) {
            options = optionsInit;
            $('#documentCount').html(options.length);
            displayOptions(options[0]);
        }).fail(function(a) {
        	if(confirm("Error retrieving Options.json.  Would you like to try retrieving from the database?")) {
        		readDBConfigs();
        	}
//            alert(JSON.stringify(a));
        });
    };

    var readDBConfigs = function() {
    	$.get('/readCollectionFiles', {
			collectionName : collections[0],
		}, function(data) {
			console.log(data);
    		$("#resultDiv").html("<h4>Mongo Config Files</h4>");
			$("#resultDiv").append(printObject(collections[0], data[0]));
			if(data[0]["MarkdownTransformConfig"]) {
				transformOptions = data[0]["MarkdownTransformConfig"];
				dataIndexTransform = 0;
	            displayTransformConfig(transformOptions[dataIndexTransform]);
			}
			if(data[0]["options"]) {
				options = data[0]["options"];
	            $('#documentCount').html(options.length);
				dataIndex = 0;
	            displayOptions(options[dataIndex]);
			}
			setupUI();
		});
    };
    
    var displayTransformConfig = function(options) {
        $("#pathToPython").val(options.pathToPython);
//        console.log("pathToPython val= " + $("#pathToPython").val());
        $("#copyFrom").val(options.copyFrom);
        $("#copyTo").val(options.copyTo);
        $("#filesToCopy").empty();
        var fileString = "";
        for(var i=0 ; i< options.filesToCopy.length ; i++) {
            fileString += options.filesToCopy[i] + ";";	
        	if(i !== options.filesToCopy.length-1) {
        		fileString += " ";        	        		
        	} else {
        		$("#filesToCopy").val(fileString);
//                console.log("filesToCopy val= " + $("#filesToCopy").val());
        	}
        }
    };
    
    var getDisplayTransformConfig = function(options) {
        var newTransform = {}
        newTransform.pathToPython = $("#pathToPython").val();
        newTransform.copyFrom = $("#copyFrom").val();
        newTransform.copyTo = $("#copyTo").val();
        var filesString = $("#filesToCopy").val();
        newTransform.filesToCopy = filesString.split(";")
        return(newTransform);
    };

    var displayOptions = function(options) {
        $("#currentDocument").val(dataIndex + 1);
        $("#pathToConfig").val(options.pathToConfig);
        $("#reallyWrite").val(options.reallyWrite ? "true" : "false");
        $("#bucketName").val(options.bucketName);
        $("#folderToWalk").val(options.folderToWalk);
        $("#s3RootFolder").val(options.s3RootFolder);
        $("#createFolderToWalkOnS3").val(options.createFolderToWalkOnS3 ? "true" : "false");
        $("#createIndex").val(options.createIndex ? "true" : "false");
        $("#filesToIgnore").val(options.filesToIgnore);
        endUrl = options.endUrl;
        $("#S3Link").hide();
    };
    
    var getDisplayOptions = function() {
        var newOptions = {};
        newOptions.index = $("#currentDocument").val();
        newOptions.pathToConfig = $("#pathToConfig").val();
        newOptions.reallyWrite = $("#reallyWrite").val() === "true" ? true : false;
        newOptions.bucketName = $("#bucketName").val();
        newOptions.folderToWalk = $("#folderToWalk").val();
        newOptions.s3RootFolder = $("#s3RootFolder").val();
        newOptions.createFolderToWalkOnS3 = $("#createFolderToWalkOnS3").val() === "true" ? true : false;
        newOptions.createIndex = $("#createIndex").val() === "true" ? true : false;
        newOptions.filesToIgnore = $("#filesToIgnore").val();
        newOptions.endUrl = options.endUrl;
        return (newOptions);
    };


    var insertConfigs = function() {
    	$.get('/insertFiles', {
			collectionName : collections[0],
			fileNames: ["MarkdownTransformConfig", "Options"]
		}, function(data) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				$("#resultDiv").append('<li>' + JSON.stringify(data[i]) + '</li>');
			}
		});
    }
    
    var saveConfigToDisk = function() {
    	$.get('/saveFiles', {
			collectionName : collections[0],
			fileNames: ["MarkdownTransformConfig", "options"]
		}, function(data) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				$("#resultDiv").append('<li>' + JSON.stringify(data[i]) + '</li>');
			}
		});
    };
    
    var buildAll = function() {
        $.getJSON("/buildAll", {
            options : JSON.stringify(transformOptions),
            index : dataIndexTransform
        }, function(result) {
            $("#buildData").empty();
            var fileArray = result.data.split("\n");
            for (var i = 0; i < fileArray.length; i++) {
                if (fileArray[i].length > 0) {
                    $("#buildData").append("<li>" + fileArray[i] + "</li>");
                }
            }
        });
    };

    var copyToS3 = function() {
        $.getJSON("/copyToS3", {
            options : JSON.stringify(options[dataIndex])
        }, function(data) {
            $("#copyResult").html("Result: " + data.result);
            $("#S3Link").attr("href", endUrl).html(endUrl).show();
        });
    };

    var forwardTransform = function() {
        if (dataIndexTransform < transformOptions.length - 1) {
            dataIndexTransform++;
            displayTransformConfig(transformOptions[dataIndexTransform]);
        }
    };

    var backwardTransform = function() {
        if (dataIndexTransform > 0) {
            dataIndexTransform--;
            displayTransformConfig(transformOptions[dataIndexTransform]);
            return dataIndexTransform;
        }
        return dataIndexTransform;
    };

    var forward = function() {
        if (dataIndex < options.length - 1) {
            dataIndex++;
            displayOptions(options[dataIndex]);
        }
    };

    var backward = function() {
        if (dataIndex > 0) {
            dataIndex--;
            displayOptions(options[dataIndex]);
            return true;
        }
        return false;
    };

    var listBuckets = function() {
        $.getJSON("/listBuckets", {
            options : JSON.stringify(options[dataIndex])
        }, function(data) {
            for (var i = 0; i < data.length; i++) {
                $("#buckets").append("<li>" + data[i] + "</li>");
            }
        });
    };
    
    var listMongoCollections = function(title) {
    	$("#resultDiv").html(title);
    	$.getJSON("/getMongoUrls", {}, function(data) {
    		console.log("listMongoCollections callback with data.length = " + data.lengeth);

    		var url = "";
    		var names = "";
    		
    		for (var i=0 ; i < data.length; i++) {
    			if(data[i].name) {
    				names += "collection: " + data[i].name + "<br />";
    			}
    			if(data[i].url) {
    				url += "url: " + data[i].url + "<br />";
    			}
    		}
    		$("#resultDiv").append(url+names);
    	});
    };
    
    var setupUI = function() {
    	$(".optionField").removeClass("modified");
//    	$(".saveConfig").attr("disabled", "disabled");
    	$(".optionField").on("change", function() {
    		$(".optionField").addClass("modified");
//        	$(".saveConfig").removeAttr("disabled");
    	});
    };
    
	var printObject = function (sName, objectToPrint, indent) {
		var stringOfObjectProperties = sName + " ";
		var i = 0;
		if (!indent) {
			indent = 3;
		}
		//stringOfObjectProperties = 'typeof (' + sName + '): ' + typeof objectToPrint + "<br/>";
		if (objectToPrint === Object(objectToPrint)) {
			stringOfObjectProperties += "{";
			for (var prop in objectToPrint) {
				if (objectToPrint.hasOwnProperty(prop)) {
					if (objectToPrint[prop] === Object(objectToPrint[prop])) {
						var newObj = "<br/>";
						for (i = 0 ; i < indent; i++) {
							newObj += "&nbsp;";
						}
						newObj += prop;
						stringOfObjectProperties += printObject(newObj, objectToPrint[prop], indent + 3);
					} else {
						stringOfObjectProperties += "<br/>";
						for(i = 0 ; i < indent; i++ ) {
							stringOfObjectProperties += "&nbsp;";
						}
						stringOfObjectProperties += prop + ': ' + objectToPrint[prop];
					}
				}
			}
			stringOfObjectProperties += "<br/>}";
		} else {
			stringOfObjectProperties = objectToPrint;
		}
		return stringOfObjectProperties;
	};

    
    return AwsUi;
});
/*
 $(document).ready(function() { 'use strict';
 new AwsUi();
 }); */
