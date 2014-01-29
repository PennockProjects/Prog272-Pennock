/* 
 * * Author: John Pennock
 */

var MyObject = function() {
    $("#paragraph01").html("This sentence added by jQuery");
    
    $("#button01").on("click", foo);	

    function foo() {
	    $("#paragraph02").html("This sentence added by jQuery");
    }

};


$(document).ready(function() { 
    MyObject();
    
});