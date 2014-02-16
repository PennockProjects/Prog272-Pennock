
Week06NodeRoutes-Pennock
========================
Assignment Instructions from Charlie
-------------------------------------

Create a node express program called NodeRoutes-LastName, where LastName is your last name. It should include the following:

- Various buttons and input controls.
- When the user clicks on one button, return the number of feet in a mile.
- When the user clicks on another button, calculate the number of feet in X miles, where X is supplied by the user in an HTML input element.
- Also provide the circumference of a circle given a radius supplied by the user.

You interface will probably consist of three buttons:

- Get Feet in Mile
- Calculate Feet
- Calculate Radius

The formula for calculating the circumference of a circle given its radius looks like this:

	Circumference = 2 * radius * Math.PI;

All the calculations should be performed on the server side, in a module, per the NodeRoutes02 example in JsObjects.

For three points extra credit, implement getFeetInMile and calculateFeet using HTTP GET calls, and use POST for calculateRadius:

    var express = require('express');
    var app = express();
    app.get(...
    app.post(...


> Written with [StackEdit](https://stackedit.io/).