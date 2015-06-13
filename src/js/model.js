// Copyright © 2015 Konsultointi Ari Vainio Oy http://www.arivain.com
// Source code for this program is dual-licensed under the EUPL v1.2 and AGPLv3 licenses.

// Model
var baseurlTest = "https://test.p.hsl.fi/api/v1/"; 
var baseurlOldTest = "https://hsl-liipi-lb-demo-1312476640.eu-west-1.elb.amazonaws.com/api/v1/";
var baseurl = baseurlTest;
var operator = "xpark";


var facilitiesArray = new Array();
var currentGeoJSON = null;  // here is saved resently read geoJSON. This is used for map viw
var hubsArray = new Array();

	var RANGEDEFAULT = "1000";  // Default of search reange is 1500m
    var range = RANGEDEFAULT;

	// http://www.reittiopas.fi/fi/?showsearchformsaved=hide&from_in=Linnatullinkatu%202%20%2CEspoo
	// Tee funktio, joka avaa reittioppaan


// Formulate taken from http://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(lat1, lon1, lat2, lon2) {
		var unit = 'K'; // K=kilometers, N=nautical miles, M=Statute miles
	    var radlat1 = Math.PI * lat1/180
	    var radlat2 = Math.PI * lat2/180
	    var radlon1 = Math.PI * lon1/180
	    var radlon2 = Math.PI * lon2/180
	    var theta = lon1-lon2
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515
	    if (unit=="K") { dist = dist * 1.609344 }
	    if (unit=="N") { dist = dist * 0.8684 }
	    return (Math.floor(dist * 10) / 10);
}

var currentPosition = null;


function calcDistances() {
	if (currentPosition != null) {
		//alert("calc facility distances");
		//facilityDistances = new Array(facilitiesArray.length);
		for (var i=0; i<facilitiesArray.length; i++) {
			//var fac = new Array(2);
			//fac[0] = facilitiesArray[i].id;
			// HUOM! käytetään laskennassa bboxia, koska se on aina vastauksessa, vaikka portteja ei olisi määritelty.
    		facilitiesArray[i].distanceFromHere = calculateDistance(
    								facilitiesArray[i].location.bbox[1],  //  ports[0].location.coordinates[1],
    								facilitiesArray[i].location.bbox[0], // ports[0].location.coordinates[0],
    								currentPosition.latitude, 
    								currentPosition.longitude);
    		//fac[1] = facilitiesArray[i].distanceFromHere;
    		//facilityDistances[i] = fac;
		}
	}
}

function calcHubDistances() {
	if (currentPosition != null) {
		for (var i=0; i<hubsArray.length; i++) {
			hubsArray[i].distanceFromHere = calculateDistance(
    								hubsArray[i].location.coordinates[1],  
    								hubsArray[i].location.coordinates[0], 
    								currentPosition.latitude, 
    								currentPosition.longitude);
		}
	}
}


function getCurrentPosition() {
   	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(saveCurrentPosition);
    } 
}

function saveCurrentPosition(position) {
    	currentPosition =  position.coords;
}

function findElem(id) {
	for (var i=0; i<facilitiesArray.length; i++) {
		if (facilitiesArray[i].id == id)
			return(facilitiesArray[i]);
	}
}

function sortFacilitiesByDistance() {
	facilitiesArray.sort(function(a,b) {
		return(a.distanceFromHere - b.distanceFromHere);
	});	
}

function sortHubsByDistance() {
	hubsArray.sort(function(a,b) {
		return(a.distanceFromHere - b.distanceFromHere);
	});	
}

function findDist(id) {
	for (var i=0; i<facilityDistances.length; i++) {
		if (id == facilityDistances[i][0])
			return(facilityDistances[i][1]);
	}
}


	$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Liipi-Application-Id','arivain.com');
    }
	});

    function getFacilities(sIn){ 
        $.ajax({
            url: baseurl + "facilities",
            cache: false,
            dataType: "json",
            complete: function(data,status) {
    			var s = sIn.toUpperCase();
                facilitiesArray = new Array();
                var f = jQuery.parseJSON(data.responseText).results;
                if ((typeof(f.length) == "number") && (f.length > 0)) {
                for (var i=0; i<f.length; i++) {
                	if (s != "") {
                		if ((f[i].name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].name.en.toUpperCase().indexOf(s) >= 0) ) {
                			getFacilityData(f[i].id);
	                	}
	                }
	                else {
	                		getFacilityData(f[i].id);
	                }
	            }
	            }
	            else {
	            	showText("Ei löytynyt P-paikkoja");
	            }
            }
        });
    }
    
    
    function getFacilityData(id){  
        $.ajax({
            url: baseurl + "facilities/" + id,
            cache: false,
            dataType: "json",
            complete: function(data,status) {
                //alert(status);
                //alert(JSON.stringify(data));
                facilitiesArray.push(jQuery.parseJSON(data.responseText));
                showFacilities(facilitiesArray);
            }
        });
    }

	function calcMinutePart(estimatedTravelTime) {
		var m = Math.floor((estimatedTravelTime - Math.floor(estimatedTravelTime) * 60) * 100);
		if (m<10)
			return("0" + m);
		else
			return(m);
	}
	
	function getEstimatedTravelTimeInHours(distance) {
	  	var estimatedTravelTime = 0.5;  // default is to ask prediction after half an hour  
    	if (distance != null) {
    		var averageSpeed = 70; // 70km/h
    		estimatedTravelTime = distance / averageSpeed;
    	}
    	return(estimatedTravelTime);
	}
		
    function getFacilityUtilization(id, outId, distance){
    	var queryUrl = baseurl + "facilities/" +  id + "/utilization";
    	var estimatedTravelTime = "0:30";  // default is to ask prediction after half an hour  
    	if (distance != null) {
    		var averageSpeed = 70; // 70km/h
    		estimatedTravelTime = distance / averageSpeed;
    		estimatedTravelTime = Math.floor(estimatedTravelTime) + ":" + 
    					calcMinutePart(estimatedTravelTime);
    	 	queryUrl = baseurl + "facilities/" +  id + "/prediction?after=" + estimatedTravelTime
    	}
        $.ajax({
            url: queryUrl,
            cache: false,
            dataType: "json",
            complete: function(data,status) {
                //alert(status);
                //alert(JSON.stringify(data));
                var facilitiesUtilization = jQuery.parseJSON(data.responseText);  //.results removed
                showFacilitiesUtilization(facilitiesUtilization, outId, id, distance);
            }
        });
    }

    
    function getFacilitiesByLocation(txtinput) {
    	//alert(txtinput);
        $.ajax({
            url: baseurl + "facilities.geojson?geometry=" + txtinput + "&maxDistance=" + range,
            cache: false,
            dataType: "geojson",
            complete: function(data,status) {
				var s =  document.forms["f1"].hakuteksti.value;
				s = s.toUpperCase();
                facilitiesArray = new Array();
                // Save geojson for map view
                currentGeoJSON = jQuery.parseJSON(data.responseText);
                removeFearureLayer();
                loadMap(currentGeoJSON, 'http://arivain.com/p/icons/vs.png', test);
                var f = jQuery.parseJSON(data.responseText).features;
                //alert(typeof(f.length) + " " +  f.length);
                if ((typeof(f == "object")) && (typeof(f.length) == "number") && (f.length > 0)) {
                for (var i=0; i<f.length; i++) {
                	if (s != "") {
                		if ((f[i].properties.name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.en.toUpperCase().indexOf(s) >= 0) ) {
	                		getFacilityData(f[i].id);
	                	}
	                }
	                else {
	                		getFacilityData(f[i].id);
	                }
	            }
	            }
	            else {
	            	showText("Ei löytynyt P-paikkoja");
	            }
            }
        });
    }
    
    function getFacilitiesByCurrentLocation() {
    	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(getFacilitiesByCurrentLocationCallback);
    	} else {
        	alert("Selain ei tue sijainnin hakemista.");
    	}
	}
	
	function getFacilitiesByCurrentLocationCallback(position) {
    	var lat = position.coords.latitude;
    	var lon = position.coords.longitude;
    	var vkn = "POINT(" + lon + " " + lat + ")";
    	getFacilitiesByLocation(vkn);
	}

    
    function getFacilitiesByRoute(txtinput){
    	//var txtinput =  document.forms["f1"].route.value;
    	range = RANGEDEFAULT; 
    	if (txtinput.indexOf("NEAREST") >= 0) {
    		range = txtinput.split(":")[1];
    		//alert(range);
    		getFacilitiesByCurrentLocation();
    	}
    	else {
    		getFacilitiesByLocation(txtinput);
    	}
    	
    }
    
    function getFacilitiesByHub(hubName, lon, lat){
    	var geometry =  'MULTIPOINT(' +  lat + " " + lon + ')';
    	//alert(geometry);
    	document.getElementById("feedbacktext").innerHTML = "Haettu P-paikat läheltä:" + hubName;
        $.ajax({
            url: baseurl + "facilities.geojson?geometry=" + geometry + "&maxDistance=" + RANGEDEFAULT,
            cache: false,
            dataType: "geojson",
            complete: function(data,status) {
				var s =  document.forms["f1"].hakuteksti.value;
				s = s.toUpperCase();
                facilitiesArray = new Array();
                var f = jQuery.parseJSON(data.responseText).features;
                if ((typeof(f.length) == "number") && (f.length > 0)) {
                for (var i=0; i<f.length; i++) {
                	if (s != "") {
                		if ((f[i].properties.name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.en.toUpperCase().indexOf(s) >= 0) ) {
	                		getFacilityData(f[i].id);
	                	}
	                }
	                else {
	                		getFacilityData(f[i].id);
	                }
	            }
	            }
	            else
	            	showText("Ei löytynyt P-paikkoja");
	            setFacilitiesSelected();
            }
        });
    }    	

    function getHubData(id){  
        $.ajax({
            url: baseurl + "hubs/" + id,
            cache: false,
            dataType: "json",
            complete: function(data,status) {
                //alert(status);
                //alert(JSON.stringify(data));
                hubsArray.push(jQuery.parseJSON(data.responseText));
                showHubs(hubsArray);
            }
        });
    }


	function getHubsByLocation(txtinput) {
    	//alert(txtinput);
        $.ajax({
            url: baseurl + "hubs.geojson?geometry=" + txtinput + "&maxDistance=" + range,
            cache: false,
            dataType: "geojson",
            complete: function(data,status) {
				var s =  document.forms["f1"].hakuteksti.value;
				s = s.toUpperCase();
                hubsArray = new Array();
                var f = jQuery.parseJSON(data.responseText).features;
                //alert(f.length);
                if ((typeof(f.length) == "number") && (f.length > 0)) {
                for (var i=0; i<f.length; i++) {
                	if (s != "") {
                		if ((f[i].properties.name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.en.toUpperCase().indexOf(s) >= 0) ) {
	                		getHubData(f[i].id);
	                	}
	                }
	                else {
	                		getHubData(f[i].id);
	                }
	            }
	            }
	            else {
	            	showText("Ei löytynyt pysäkkejä");
	            }
            }
        });
    }

    function getHubsByCurrentLocation() {
    	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(getHubsByCurrentLocationCallback);
    	} else {
        	alert("Selain ei tue sijainnin hakemista.");
    	}
	}
	
	function getHubsByCurrentLocationCallback(position) {
    	var lat = position.coords.latitude;
    	var lon = position.coords.longitude;
    	var vkn = "POINT(" + lon + " " + lat + ")";
    	getHubsByLocation(vkn);
	}


    function getHubsByRoute(){
    	var txtinput =  document.forms["f1"].route.value;
    	range = RANGEDEFAULT; 
    	if (txtinput.indexOf("NEAREST") >= 0) {
    		range = txtinput.split(":")[1];
    		getHubsByCurrentLocation();
    	}
    	else {
    		getHubsByLocation(txtinput);
    	}
    }

    function getHubsByFacility( facName, lon, lat) {
    	document.getElementById("feedbacktext").innerHTML  = "Haettu pysäkit läheltä:" + facName;
    	var geometry =  'MULTIPOINT(' +  lon + " " + lat + ')';
        $.ajax({
            url: baseurl + "hubs.geojson?geometry=" + geometry + "&maxDistance=" + RANGEDEFAULT,
            cache: false,
            dataType: "geojson",
            complete: function(data,status) {
				var s =  document.forms["f1"].hakuteksti.value;
				s = s.toUpperCase();
                hubsArray = new Array();
                //alert(data.responseText);
                var f = jQuery.parseJSON(data.responseText).features;
                //alert(f.length);
				if ((typeof(f.length) == "number") && (f.length > 0)) {
                for (var i=0; i<f.length; i++) {
                	if (s != "") {
                		if ((f[i].properties.name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(f[i].properties.name.en.toUpperCase().indexOf(s) >= 0) ) {
	                		getHubData(f[i].id);
	                	}
	                }
	                else {
	                		getHubData(f[i].id);
	                }
	            }
	            }
	            else {
	            	showText("Ei löynyt pysäkkejä");
	            }
	            setHubsSelected();
            }
        });
    }
    


    function getHubs(){  
    	var txtinput =  document.forms["f1"].hakuteksti.value;
        $.ajax({
            url: baseurl + "hubs?body=" + txtinput,
            cache: false,
            dataType: "json",
            complete: function(data,status) {
    			var s =  document.forms["f1"].hakuteksti.value;
    			s = s.toUpperCase();
                //alert(status);
                //alert(JSON.stringify(data.responseText));
                h = jQuery.parseJSON(data.responseText).results;
                if ((typeof(h.length) == "number") && (h.length > 0)) {
                for (var i=0; i<h.length; i++) {
                	if (s != "") {
                		if ((h[i].name.fi.toUpperCase().indexOf(s) >= 0) || 
                			(h[i].name.sv.toUpperCase().indexOf(s) >= 0) || 
                			(h[i].name.en.toUpperCase().indexOf(s) >= 0) ) {
                			getHubData(h[i].id);
	                	}
	                }
	                else {
	                		getHubData(h[i].id);
	                }
	            }
	            }
	            else 
	            	showText("Ei löytynyt pysäkkejä");
            }
        });
    }

    function getHubData(id){  
        $.ajax({
            url: baseurl + "hubs/" + id,
            cache: false,
            dataType: "json",
            complete: function(data,status) {
                //alert(status);
                //alert(JSON.stringify(data));
                hubsArray.push(jQuery.parseJSON(data.responseText));
                showHubs(hubsArray);
            }
        });
    }
        
    
    function calcAveOfBbox(bbox) {
    	var ret = new Array(2);
    	ret[0] = (bbox[0] + bbox[2]) / 2;
    	ret[1] = (bbox[1] + bbox[3]) / 2;
    	return(ret);
    }
        
    function getCoordinatesOfFacility(facility) {
    	if (typeof(facility.ports[0]) != "undefined") {
    		// Portteja on määritelty. Ota ensimmäisen portin koordinaatit paikaksi
	    	return(facility.ports[0].location.coordinates);
	    }
	    else  {
	    	// Ei määritelty yhtään porttia, joten ota paikaksi bbox koordinaattiparin keskiarvo.
	    	return(calcAveOfBbox(facility.location.bbox));
	    }
    }

    function getCoordinatesOfHub(hub) {
    	if (typeof(hub.location.coordinates) != "undefined") {
    		// Portteja on määritelty. Ota ensimmäisen portin koordinaatit paikaksi
	    	return(hub.location.coordinates);
	    }
	    return(null);
    }
