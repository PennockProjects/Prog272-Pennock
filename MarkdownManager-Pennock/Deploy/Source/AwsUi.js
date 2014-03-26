define(['jquery'], function() {'use strict';

    var buttons = null;
    var options = null;
    var transformOptions = null;
    var dataIndex = 0;
    var dataIndexTransform = 0;
    var endUrl;
	var collections = ['configFiles', 'Poems'];

    function AwsUi() {
    	$("#readFileConfigs").on("click", getFileConfigs );
    	$("#readConfigs").on("click", readDBConfigs);
        $("#saveConfigs").on("click", saveConfigsToDisk);
        $("#deleteDBConfigs").on("click", deleteDbConfigs);
        $("#insertConfigs").on("click", insertConfigs);
    	
        $("#transformForwardButton").click(forwardTransform);
        $("#tranformBackButton").click(backwardTransform);
        $("#forwardButton").click(forward);
        $("#backButton").click(backward);

        $("#listBuckets").click(listBuckets);
        
        $("#readDbMds").on("click", readDbMds);
        $("#writeDbMds").on("click", writeDbMds);

        $("#copyToS3").click(copyToS3);
        $("#buildAll").click(buildAll);
        
        listMongoCollections();
        getFileConfigs();
    }
    
///////////// Config Functions /////////////////////////////////////////////////////////////
    
    // Grabs MarkdownTransformConfig.json and Options.json and updates UI
    var getFileConfigs = function() {
        getBuildConfig();
        getOptions();
        setupModifyInput();    	
    };
    
    // This sets up the input fields to change color when modified
    var setupModifyInput = function() {
    	$(".optionField").removeClass("modified");
    	$(".optionField").on("change", function() {
    		$(".optionField").addClass("modified");
    	});
    };
    
    // This calls the server to get the MarkdownTransformConfig.json file
    //    format of the file is (and must be):
    //[{
 	//	"pathToPython": "C:\\Python33\\Python.exe",
 	//	"copyFrom": "C:\\Users\\John\\Dropbox\\StackEdit",
 	//	"copyTo": "C:\\Dev\\GitHub\\Prog272-Pennock\\MarkdownManager-Pennock\\site\\Site",
 	//	"filesToCopy": ["test", "Sonnet1", "Sonnet2", "Sonnet3", "Sonnet4", "Sonnet5"]
 	//},{
 	//	"pathToPython": "/usr/bin/python3.3",
 	//	"copyFrom": "/home/adminuser/Dropbox/StackEdit",
 	//	"copyTo": "/home/adminuser/Git/Prog272-Pennock/MarkdownManager-Pennock/site/Site",
 	//	"filesToCopy": ["test", "Sonnet1", "Sonnet2", "Sonnet3", "Sonnet4", "Sonnet5"]
 	//}]
    
    // Asks the server to read the MarkdownTransformConfig.json.  
    //   if successful, populates the html with results
    var getBuildConfig = function() {
        $.getJSON("/getBuildConfig", function(optionsInit) {
            transformOptions = optionsInit;
            // Assumes that filesToCopy is an array of fileName strings
            showTransformConfig(transformOptions[dataIndexTransform]);
        }).fail(function(a) {
        	if(confirm("Error retrieving MarkdownTransformConfig.json.  Would you like to try retrieving from the database?")) {
        		readDBConfigs();
        	}
        });
    };
    
    // Asks the server to read the Options.json.  
    //   if successful, populates the html with results
    var getOptions = function() {
        $.getJSON("/getOptions", function(optionsInit) {
            options = optionsInit;
            $('#documentCount').html(options.length);
            showOptions(options[0]);
        }).fail(function(a) {
        	if(confirm("Error retrieving Options.json.  Would you like to try retrieving from the database?")) {
        		readDBConfigs();
        	}
        });
    };

    // displays the transform config
    var showTransformConfig = function(options) {
        $("#pathToPython").val(options.pathToPython);
        $("#copyFrom").val(options.copyFrom);
        $("#copyTo").val(options.copyTo);
        $("#filesToCopy").empty();
        var fileString = "";
        for(var i=0 ; i < options.filesToCopy.length ; i++) {
        	if(i !== options.filesToCopy.length-1) {
                fileString += options.filesToCopy[i] + ",";	
        	} else {
        		fileString += options.filesToCopy[i];
        	}
    		$("#filesToCopy").val(fileString);
        }
    };
    
    // gathers transform config items from the UI
    var gatherTransformConfig = function() {
        var newTransform = {}
        newTransform.pathToPython = $("#pathToPython").val();
        newTransform.copyFrom = $("#copyFrom").val();
        newTransform.copyTo = $("#copyTo").val();
        var filesString = $("#filesToCopy").val();
        newTransform.filesToCopy = filesString.split(",");
        return(newTransform);
    };

    // displays the options in the UI
    var showOptions = function(option) {
        $("#currentDocument").val(dataIndex + 1);
        $("#pathToConfig").val(option.pathToConfig);
        $("#reallyWrite").val(option.reallyWrite);
        $("#bucketName").val(option.bucketName);
        $("#folderToWalk").val(option.folderToWalk);
        $("#s3RootFolder").val(option.s3RootFolder);
        $("#createFolderToWalkOnS3").val(option.createFolderToWalkOnS3);
        $("#createIndex").val(option.createIndex);
        $("#filesToIgnore").val(option.filesToIgnore);
        endUrl = option.endUrl;
        $("#S3Link").hide();
    };
    
    // gathers options config items from the UI
    var gatherOptions = function() {
        var newOptions = {};
        newOptions.index = $("#currentDocument").val();
        newOptions.pathToConfig = $("#pathToConfig").val();
        newOptions.reallyWrite = $("#reallyWrite").val() === "true" ? true : false;
        newOptions.bucketName = $("#bucketName").val();
        newOptions.folderToWalk = $("#folderToWalk").val();
        newOptions.s3RootFolder = $("#s3RootFolder").val();
        newOptions.createFolderToWalkOnS3 = $("#createFolderToWalkOnS3").val() === "true" ? true : false;
        newOptions.createIndex = $("#createIndex").val() === "true" ? true : false;
        var filesToIgnore = $("#filesToIgnore").val();
        newOptions.filesToIgnore = filesToIgnore.split(",");
        newOptions.endUrl = endUrl;
        return (newOptions);
    };

    // transport functions for the UI
    var forwardTransform = function() {
        if (dataIndexTransform < transformOptions.length - 1) {
            dataIndexTransform++;
            showTransformConfig(transformOptions[dataIndexTransform]);
        }
    };

    var backwardTransform = function() {
        if (dataIndexTransform > 0) {
            dataIndexTransform--;
            showTransformConfig(transformOptions[dataIndexTransform]);
            return dataIndexTransform;
        }
        return dataIndexTransform;
    };

    var forward = function() {
        if (dataIndex < options.length - 1) {
            dataIndex++;
            showOptions(options[dataIndex]);
        }
    };

    var backward = function() {
        if (dataIndex > 0) {
            dataIndex--;
            showOptions(options[dataIndex]);
            return true;
        }
        return false;
    };

    // create a JSON version of both MarkdownTransformConfig and Options
    //   looks at what is currently displayed and updates that
    var createJsonConfigs = function() {
    	var jsonObjects = [];
    	var transformObject = transformOptions;
    	transformObject[dataIndexTransform] = gatherTransformConfig();
    	jsonObjects.push({
			fileName: "MarkdownTransformConfig.json",
			keywords: ["config"],
			contents: transformObject
    	});
    	console.log(jsonObjects[0]);

    	var optionsObject = options;
    	optionsObject[dataIndex] = gatherOptions();
    	jsonObjects.push({
			fileName: "Options.json",
			keywords: ["config"],
			contents: optionsObject 
    	})
    	console.log(jsonObjects[1]);
    	return(jsonObjects);
    };

    // saves the JSON configs to Disk via the server
    //    note, even though other fields are included such as 'keywords', only the 'contents' is stored
    //	  While I can store everything, the python transform gets confused unless it's in contents only format.
    var saveConfigsToDisk = function() {
    	var jsonObjects = createJsonConfigs();
    	$.post('/writeFiles', {
			jsonObjects : jsonObjects,
			stringify: true
		}, function(data) {
			console.log(data);
			$("#resultDiv").html(JSON.stringify(data));
		});
    };
    
// CONFIG ACTIONS AGAINST THE Database ///////////////////////////////
    // reads the config files from the database and retrieves the 'contents' into the global transformOptions, and options
    var readDBConfigs = function() {
    	$.get('/readCollectionFiles', {
			collectionName : collections[0],
		}, function(data) {
			console.log(data);
    		$("#resultDiv").html("<h4>Mongo Config Files</h4>");
    		if(data.length) {
    			for(var i=0 ; i < data.length ; i++) {
    				$("#resultDiv").append("<li>" + printObject("dbConfig: ", data[i]) + "</li>");
    				if(data[i].fileName === "MarkdownTransformConfig.json") {
    					transformOptions = data[i].contents;
    					dataIndexTransform = 0;
    					showTransformConfig(transformOptions[dataIndexTransform]);
    				}
    				if(data[i].fileName === "Options.json") {
    					options = data[i].contents;
    					dataIndex = 0;
    		            showOptions(options[dataIndex]);
    				}
    			}
    			setupModifyInput();
			}
		});
    };

    // This one writes the configs to DB.
    //    note, the DB contains all the keywords unlike the write to disk.
    //    NOTE2: it adds configs, does not update them.
    var insertConfigs = function() {
    	var jsonObjects = createJsonConfigs();
    	$.get('/insertData', {
			collectionName : collections[0],
			jsonObjects : jsonObjects
		}, function(data) {
			console.log(data);
			$("#resultDiv").html("<h4>Insert Configs</h4>");
			for(var i=0 ; i < data.mongoDocument.length ; i++) {
				var fileName = data.mongoDocument[i].fileName
				var documents = data.mongoDocument[i].contents;
				$("#resultDiv").append(fileName + "<br />" + documents + "<br />");
			}
		});
    };
    
    // Remove all documents from the 'configFiles' collection
    var deleteDbConfigs = function() {
    	if(confirm('Are You Sure You Want to Delete the Config data in Mongo?')) {
    		$.get('/deleteData', {
    			collectionName : collections[0]
        	}, function(data) {
        		console.log(data);
   				$("#resultDiv").html("<h4>delete Db Configs</h4>" + JSON.stringify(data));
        	});
    	}
    };
    
// Database Poems //////////////////////////////
    var poems = [];
    
   var readDbMds = function() {
		$.get('/readCollectionFiles', {
			collectionName : collections[1],
		}, function(data) {
			console.log(data);
			$("#resultDiv").html("<h4>Mongo Poems</h4>");
			if(data.length) {
				$("#resultDiv").append("<li> Count: " + data.length + "</li>");
				// shallow copy
				poems = data.slice(0);
				transformPoemsJsonToMd(poems);
//				console.log(JSON.stringify(poems[10]));
				var targetDir = $("#copyFrom").val();
				$.post('/writeFiles', {
					jsonObjects : poems,
					rootDir: targetDir,
					stringify: false
				}, function(data) {
					$("#resultDiv").html("<h4>Markdown Poems created in " + targetDir + "</h4>");
					var list = $("<ul></ul>").attr({"id":"fileNames"});
					$("#resultDiv").append(list);
					for(var i=0; i < data.fileNames.length ; i++) {
						$("#fileNames").append("<li>" + data.fileNames[i] + "</li>");				
					}
				});
			}
		});
	};
	
	var transformPoemsJsonToMd = function(poems) {
		var subDirBase = "Poems";
		
		for(var i=0, poem, markdown ; i < poems.length ; i++) {
			var folderNum = (Math.floor(i/10) + 1).toString();
			poem = poems[i];
			markdown = "";
			markdown += "#"+poem.title + "\n";
			markdown += "##"+poem.author + "\n";
			if(poem.keywords.length > 0) {
				markdown += "###Keywords: ";
				for(var j=0 ; j < poem.keywords.length ; j++) {
					markdown += poem.keywords[j] + ",";
				}
				markdown += "\n";
			}
			markdown += "> " + poem.content + "\n";
			poem.contents = markdown;
//			console.log("poem.contents: " + poem.contents);
			poem.fileName = poem.author.replace(/ /g,'') + poem.title.replace(/ /g,'') + ".md";
			poem.subDir = subDirBase + folderNum;
			poems[i] = poem;
		}
	};
	
	var writeDbMds = function() {
		// TBD
	};
	
    // Markdown to HTML tranform function 
    var buildAll = function() {
    	var input = {
                options : JSON.stringify(transformOptions),
                index : dataIndexTransform
            };
    	console.log(printObject("input", input));
    	
        $.getJSON("/buildAll", input, function(result) {
            $("#buildData").empty();
            var fileArray = result.data.split("\n");
            for (var i = 0; i < fileArray.length; i++) {
                if (fileArray[i].length > 0) {
                    $("#buildData").append("<li>" + fileArray[i] + "</li>");
                }
            }
        });
    };

    // Copies Site up to S3 bucket
    var copyToS3 = function() {
        $.getJSON("/copyToS3", {
            options : JSON.stringify(options[dataIndex])
        }, function(data) {
            $("#copyResult").html("Result: " + data.result);
            $("#S3Link").attr("href", endUrl).html(endUrl).show();
        });
    };

    // Lists S3 Buckets
    var listBuckets = function() {
        $.getJSON("/listBuckets", {
            options : JSON.stringify(options[dataIndex])
        }, function(data) {
        	$("#resultDiv").html("<h4>Aws Buckets</h4>");

            for (var i = 0; i < data.length; i++) {
   				$("#resultDiv").append(data[i] + "<br />");
            }
        });
    };
    
    // Lists DB Collections
    var listMongoCollections = function() {
    	$("#resultDiv").html("<h4>Mongo URL and Collections</h4>");
    	$.getJSON("/getMongoUrls", {}, function(data) {
    		console.log("listMongoCollections callback with data.length = " + data.length);

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
    
    // Helper function for better output
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
