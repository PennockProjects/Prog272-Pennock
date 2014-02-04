/*jshint devel: true, browser: true, jquery: true, strict: true */
/*global App: false */

App.Main = (function() {'use strict';

	// Application Constructor
	function Main() {
		console.log("debug: App constructor called");
		bindEvents();
	}

	/*
	 * Bind any events that are required on startup.
	 * Common events: 'load', 'deviceready', 'offline', and 'online'.
	 */
	var bindEvents = function() {
		console.log("debug: App bindEvents called");
		document.addEventListener('deviceready', onDeviceReady, false);
		hookParagraphButtons();
	};

	// Called when device is fully initialized
	var onDeviceReady = function() {
		console.log("debug: App onDeviceReady called");
		showProgramState();
		showDate();
	};

	var showProgramState = function() {
		var listeningElement = $('.listening');
		var receivedElement = $('.received');
		listeningElement.attr('style', 'display:none;');
		receivedElement.attr('style', 'display:block;');
	};

	var showDate = function() {
		console.log('debug: showDate called');
		var util = new App.Utility();
		$("#curDate").html("Current Date: " + util.getToday());
	};

	var showDate = function() {
		console.log('debug: showDate called');
		var util = new App.Utility();
		$("#curDate").html("Current Date: " + util.getToday());
	};

	var hookParagraphButtons = function() {
		var dataSource = new FetchData();
		$('#buttonHtml01').on("click", {
			file : "Sources.html",
			sourceIdd : "paragraph01",
			targetIdd : "div01"
		}, dataSource.loadHTMLFragment);
		$('#buttonHtml02').on("click", {
			file : "Sources.html",
			sourceIdd : "paragraph02",
			targetIdd : "div01"
		}, dataSource.loadHTMLFragment);
		$('#buttonHtml03').on("click", {
			file : "Sources.html",
			sourceIdd : "paragraph03",
			targetIdd : "div01"
		}, dataSource.loadHTMLFragment);

		$('#buttonJson01').on("click", {
			file : "presidents.json",
			index : 0,
			targetIdd : "div01"
		}, dataSource.getJsonData);
		$('#buttonJson02').on("click", {
			file : "presidents.json",
			index : 1,
			targetIdd : "div01"
		}, dataSource.getJsonData);
		$('#buttonJson03').on("click", {
			file : "presidents.json",
			index : 2,
			targetIdd : "div01"
		}, dataSource.getJsonData);
	};

	return Main;
})();

$(document).ready(function() {"use strict";
	new App.Main();
});
