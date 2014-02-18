#!/usr/bin/env node
 
/**
 * Takes specified Markdown files outputs them as HTML.
 *
 * Requires showdown:
 *
 * 	npm install showdown
 *
 * dan@dans.im
 * 2012-02-28
 * see: https://gist.github.com/dansimau/1931720 
 */
 
var fs = require('fs');
var path = require('path');
 
var showdown = require('showdown').Showdown;
 
if (process.argv.length < 3) {
	console.error('Converts specified Markdown file to HTML');
	console.error('Usage: ' + require('path').basename(__filename) + ' <file1> [file2 [...]]');
	process.exit(99);
}
 
// Input file list
var inputs = process.argv;
 
// Remove first two arguments as they are node and bin paths
inputs.shift();
inputs.shift();
 
// Process options
var options = {
	outputext: ".html"
};
 
for (f in process.argv) {
	if (process.argv[f] == "--stdout") {
		options.stdout = true;
		// Remove this arg from file list
		delete inputs[f];
	}
}
 
for (f in inputs) {
 
	var md;
	var text;
	var inputf;
	var outputf;
	var converter;
 
	inputf = inputs[f];
	converter = new showdown.converter();
 
	// Read file
	text = fs.readFileSync(inputf, 'utf-8');
 
	// Convert to Markdown
	md = converter.makeHtml(text);
 
	if (!options.stdout) {
 
		// Write file
		var outputf = path.basename(inputf, path.extname(inputf)) + options.outputext;
		fs.writeFileSync(outputf, md, 'utf-8');
 
		console.log(outputf);
 
	} else {
 
		// Output Markdown to console
		console.log(md);
	}
}