/**
 * @author John
 */

var express = require('express');
var app = express();

 

app.get('/', function(req, result){

  var body = 'Express Data';
  result.setHeader('Content-Type', 'text/plain');
  result.setHeader('Content-Length', Buffer.byteLength(body));
  result.end(body);

});

app.listen(30025);
console.log('Listening on port 30025');