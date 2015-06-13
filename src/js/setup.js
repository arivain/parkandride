// Copyright © 2015 Konsultointi Ari Vainio Oy http://www.arivain.com
// Source code for this program is dual-licensed under the EUPL v1.2 and AGPLv3 licenses.

var GOOGLE = 0;
var OPENSTREETMAP = 1

var setup = {
  "mapLinksTo": GOOGLE,
  "defaultRoute": "",
  "destination": ""
}

function writeSetup() {
	if (typeof(localStorage) != 'undefined') {
		alert("Writing to localStorage " + JSON.stringify(setup));
		localStorage.setItem('setup', JSON.stringify(setup));
	}
	else {
		console.log("Browser doesn\'t support local storage");
	}
}


function setItUp() {
	if (document.getElementById("map").selectedIndex == 0)
		setup.mapLinksTo = GOOGLE;
	else
		setup.mapLinksTo = OPENSTREETMAP
	//alert(document.getElementById("map").selectedIndex);
	
	var el = document.getElementById("defaultRoute");
	setup.defaultRoute = el.options[el.selectedIndex].value;
	//alert(setup.defaultRoute);
	
	setup.destination = document.getElementById("destination").value;
	//alert(setup.destination);	
	
	writeSetup();
}

