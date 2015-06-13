// Copyright © 2015 Konsultointi Ari Vainio Oy http://www.arivain.com
// Source code for this program is dual-licensed under the EUPL v1.2 and AGPLv3 licenses.

// View

var TABLESTART = "<table>";
var HUBSTABLEHEADER = "<tr><th>id</th><th>Nimi</th><th>Osoite</th><th>Kartta</th></tr>";
var FACILITYTABLEHEADER = "<tr><th>id</th><th>Nimi</th><th>Autopaikkoja</th><th>Tila</th><th>Hinnoittelu</th><th>Kartta</th></tr>";
var ROWSTART = "<tr>";
var ROWEND = "</tr>";
var COLSTART = "<td>";
var COLEND = "</td>";
var TABLEEND = "</table>";

var LISTSTART = '<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-inset="true" data-role="listview">';
var LISTITEM = '<li class="ui-li-has-alt"><a class="ui-btn" ';
var LISTICONLINK = '<a class="ui-btn ui-btn-icon-notext ui-icon-arrow-u-r" data-icon="arrow-u-r" data-transition="pop" title="Reittiopas" ';
var LISTICONLINK2 = '<a class="ui-btn ui-btn-icon-notext ui-icon-location" data-icon="location" data-transition="pop" title="Näytä kartalla" ';
var LISTICONLINK3 = '<a data-role="button" data-transition="pop" title="Näytä kartalla" ';



var STATUSTXTFI = {
  "IN_OPERATION":"Toiminnassa",
  "INACTIVE":"Ei toiminnassa",
  "TEMPORARILY_CLOSED":"Tilapäisesti kiinni",
  "EXCEPTIONAL_SITUATION":"Poikkeustilanne"
};

var DAYTYPE = {
  "BUSINESS_DAY":"Arkisin",
  "SATURDAY":"Lauantaisin",
  "SUNDAY":"Pyhisin"
};

var SERVICES = {
  "ELEVATOR":			"Hissi",
  "TOILETS":			"WC",
  "ACCESSIBLE_TOILETS":	"Inva-WC",
  "LIGHTING":			"Valaistus",
  "COVERED":			"Katettu",
  "SURVEILLANCE_CAMERAS":"Valvontakamera",
  "VENDING_MACHINE":	"Lippuautomaatti",
  "INFORMATION_POINT":	"Info-point",
  "PAY_DESK":			"Maksutiski",
  "CAR_WASH":			"Autonpesu",
  "REPAIR_SHOP":		"Korjaamo",
  "SHOE_SHINE":			"Kengänkiillotus",
  "PAYMENT_AT_GATE":	"Maksu portilla",
  "UMBRELLA_RENTAL":	"Sateenvarjovuokraus",
  "PARKING_SPACE_RESERVATION":"Paikanvaraus",
  "ENGINE_IGNITION_AID":"Käynnistysapu",
  "FIRST_AID":			"Ensiapu",
  "STROLLER_RENTAL":	"Lastenrattaiden vuokraus",
  "INFO_SCREENS":		"Info screenit",
  "BICYCLE_FRAME_LOCK":	"Polkupyörän runkolukitus"
};

var SERVICEICONS = {
  "ELEVATOR":"elevator.png",
  "TOILETS":"toilets.png",
  "ACCESSIBLE_TOILETS":"accessibletoilets.png",
  "LIGHTING":"lightning.png",
  "COVERED":"covered",
  "SURVEILLANCE_CAMERAS":"surveillancecameras.png",
  "VENDING_MACHINE":"vendingmashine.png",
  "INFORMATION_POINT":"informationpoint.png",
  "PAY_DESK":"paydesk.png",
  "CAR_WASH":"carwash.png",
  "REPAIR_SHOP":"repairshop.png",
  "SHOE_SHINE":"shoeshine.png",
  "PAYMENT_AT_GATE":"paymentatgate.png",
  "UMBRELLA_RENTAL":"umbrellarental.png",
  "PARKING_SPACE_RESERVATION":"parkingspacereservation.png",
  "ENGINE_IGNITION_AID":"engineignitionaid.png",
  "FIRST_AID":"firsaid.png",
  "STROLLER_RENTAL":"strollerrental.png",
  "INFO_SCREENS":"infoscreens.png",
  "BICYCLE_FRAME_LOCK":"bicycleframelock.png"
};

var PAYMENTTYPES = { 
  "COINS":"Kolikko",
  "NOTES":"Seteli",
  "DEBIT_CARD":"Pankkikortti",
  "VISA_ELECTRON":"Visa Electron",
  "VISA_CREDIT":"Visa",
  "AMERICAN_EXPRESS":"American Express",
  "MASTERCARD":"MasterCard",
  "DINERS_CLUB":"Diners Club",
  "HSL_TRAVEL_CARD":"HSL matkakortti",
  "OTHER":"muu"
};

var USAGES = {
  "PARK_AND_RIDE":"Liityntäpysäköinti",
  "HSL_TRAVEL_CARD":"Liitytäpysäköinti matkakortilla",
  "COMMERCIAL":"Kaupallinen"
};

var PAYMENTTYPEICONS = {
  "COINS":"coins.png",
  "NOTES":"notes.png",
  "DEBIT_CARD":"debitcard.png",
  "VISA_ELECTRON":"visaelectron.png",
  "VISA_CREDIT":"visacredit.png",
  "AMERICAN_EXPRESS":"americanexpress.png",
  "MASTERCARD":"mastercard.png",
  "DINERS_CLUB":"dinersclub.png",
  "HSL_TRAVEL_CARD":"hsltravelcard.png",
  "OTHER":"other.png"
};
  
function solveStatus(status) {
	return(STATUSTXTFI[status]);
};

var PRICINGFI = {
  "PARK_AND_RIDE_247_FREE":"Liityntäpysäköinti ilmainen 24/7",
  "CUSTOM":"Maksullinen",
};

var CAPACITYTYPES = {
  "CAR":"Henkilöuto",
  "DISABLED":"Invapaikka",
  "ELECTRIC_CAR":"Sähköauto",
  "MOTORCYCLE":"Moottoripyörä",
  "BICYCLE":"Polkupyörä",
  "BICYCLE_SECURE_SPACE":"Polkypyörä, lukittu tila"
}


function servicesList(srv) {
	//console.log("srv.length:" + srv.length);
	if (typeof(srv) == 'undefined')
		return("");
	if (srv == null)
		return("");
	var s = "";
	for (var i=0; i < srv.length; i++) {
		s += SERVICES[srv[i]] + (i<(srv.length-1)? ", " : "");
	}
	return(s);
}

//console.log("Pitäisi tulla Katettu: " + SERVICES["COVERED"]);

console.log("test servicesList: " + servicesList(["ELEVATOR","CAR_WASH"]));

// EI KÄYTETÄ TÄTÄ
function solvePricing(pricingMethod, prices) {
	if (pricingMethod == "PARK_AND_RIDE_247_FREE")
		return(PRICINGFI[pricingMethod]);
	else {
		return(DAYTYPE[prices[0].dayType] + " " + prices[0].time.from + "-" + prices[0].time.until + "<br/>" + 
				prices[0].price.fi);
	}
}

function solveCurrentDayType() {
	var d = (new Date()).getDay();
	if (d == 0)
		return('SUNDAY');
	if (d == 6)
		return('SATURDAY');
	else
		return('BUSINESS_DAY');
}

function splitRows(s) {
	var so= "";
	for (var i=0; i<s.length; i++) {
		so += s.charAt(i);
		if (i % 25 == 0)
			so += "<br/>";
	}
	return(so);
}

function showRows(s) {
	return("<br/>" + s); 
}

function solvePriceToday(facility) {
	if (facility.pricingMethod == "PARK_AND_RIDE_247_FREE")
		return('Ilmainen liityntäpysäköinti'); 
	else { //CUSTOM
		var currentDayType = solveCurrentDayType();
	 	for (var i=0; i<facility.pricing.length; i++) {
	 		if ((facility.pricing[i].capcityType='CAR') && (facility.pricing[i].dayType == currentDayType)) {
	 			// usage on joku näistä: "PARK_AND_RIDE", "HSL_TRAVEL_CARD", "COMMERCIAL"
	 			var usage = "";
	 			if (facility.pricing[i].usage == 'PARK_AND_RIDE')
	 				usage = 'Liityntäpysäköinti';
	 			else if (facility.pricing[i].usage == 'HSL_TRAVEL_CARD')
	 				usage = 'Liityntä matkakortilla';
	 			else if (facility.pricing[i].usage == 'COMMERCIAL')
	 				usage = 'Kaupallinen';
	 			
				return(facility.pricing[i].time.from + "-" + facility.pricing[i].time.until + "<br/>" +
					usage  +  
					(facility.pricing[i].price != null ? showRows(facility.pricing[i].price.fi) : ""));
	 		}
	 	}
	}
}


function newWinName() {
	return("Win" + Math.floor(Math.random() * 10000));
}

function linkToGoogleMaps(coordinates) {
   	var gurlbase= "http://maps.google.com/maps?z=12&t=m&q=loc:";  //38.9419+-78.3020
	var url = gurlbase + coordinates[1] + " " + coordinates[0];
	//var url = "comgooglemaps://?q=Solmu=" +  coordinates[1] + "," + coordinates[0];
	return("<a href='" + url + "' target=' + newWinName() + '><img height='50px' src='map.PNG'></a>");
} 

function linkToGoogleMaps2(coordinates) {
   	var gurlbase= "http://maps.google.com/maps?z=12&t=m&q=loc:";  //38.9419+-78.3020
	var url = gurlbase + coordinates[1] + " " + coordinates[0];
	//var url = "comgooglemaps://?q=Solmu=" +  coordinates[1] + "," + coordinates[0];
	return(LISTICONLINK2 + " href='#' onClick=\"window.open('" + url + "')\" target=' + newWinName() + '>");
}

function linkToGoogleMapsButton(coordinates) {
   	var gurlbase= "http://maps.google.com/maps?z=12&t=m&q=loc:";  //38.9419+-78.3020
	var url = gurlbase + coordinates[1] + " " + coordinates[0];
	//var url = "comgooglemaps://?q=Solmu=" +  coordinates[1] + "," + coordinates[0];
	return(LISTICONLINK3 + ' href="' + url + '" target="' + newWinName() + '">');
}

function linkToOpenStreetMap(coordinates) {
   	var urlbase= "http://www.openstreetmap.org/search?query=";
   	var url = urlbase + coordinates[1] + " " + coordinates[0];
   	url += "#map=18/" + coordinates[1] + "/" + coordinates[0]
	return(LISTICONLINK2 + " href='#' onClick=\"window.open('" + url + "')\" target=' + newWinName() + '>");   	
}

function linkToOpenStreetMapButton(coordinates) {
   	var urlbase= "http://www.openstreetmap.org/search?query=";
   	var url = urlbase + coordinates[1] + " " + coordinates[0];
   	url += "#map=18/" + coordinates[1] + "/" + coordinates[0]
	return(LISTICONLINK3 + ' href="' + url + '" target="' + newWinName() + '">');   	
}

function linkToAppleMap(coordinates) {
   	var urlbase= "http://maps.apple.com/?q=";
   	var url = urlbase + coordinates[1] + "," + coordinates[0];
   	return(LISTICONLINK2 + " href='#' onClick=\"window.open('" + url + "')\" target=' + newWinName() + '>");   	
}

function linkToMap(coordinates) {
	if (initValues.map == OPENSTREETMAP)
		return(linkToOpenStreetMap(coordinates));
	if (initValues.map == APPLEMAP)
		return(linkToAppleMap(coordinates));
	else
		return(linkToGoogleMaps2(coordinates));
} 

function getMapState(t) {
	if (initValues.map == t)
		return('selected');
	else
		return('');
}

function urlToReittiopasFrom(address, distance) {
	//var rourl = "reittiopas.html#" + address ;
	//http://m.reittiopas.fi/fi/index.php?
	//		mod=rs&jsEnabled=1&select-from=OFF&txtFrom=Hansatie+203&fromCoord=&isFromSearch=OFF&
	// 		select-to=OFF&txtTo=Opastinsilta+6&toCoord=&isToSearch=OFF&
	//		is-now=ON&hour=09&minute=36&timetype=departure&day=14&month=04&year=2015&
	//		cmargin=3&wspeed=70&route-type=fastest&stz=0&
	//		bus=bus&tram=tram&metro=metro&train=train&uline=uline&
	//		service=service&nroutes=3&search=Hae+Reitti&is-advanced=OFF
	var rourl = "http://m.reittiopas.fi/fi/index.php?mod=rs&jsEnabled=1&select-from=OFF&fromCoord=&isFromSearch=OFF&cmargin=3&wspeed=70&route-type=fastest&stz=0&bus=bus&tram=tram&metro=metro&train=train&uline=uline&service=service&nroutes=3&search=Hae+Reitti&is-advanced=OFF";
	rourl += "&txtFrom=" + address;
	rourl += "&is-now=OFF";
	var now = new Date();
	var estimTravelTimeHours = getEstimatedTravelTimeInHours(distance);
	now.setTime(now.getTime() + (estimTravelTimeHours * 3600 * 1000));
	rourl += "&hour=" + now.getHours();
	rourl += "&minute=" + now.getMinutes();
	rourl += "&timetype=departure";
	rourl += "&day=" + now.getDate();
	rourl += "&month=" + (now.getMonth() + 1);
	rourl += "&year=" + now.getFullYear();
	rourl += "&select-to=OFF&txtTo=" +  initValues.dest  + "&toCoord=&isToSearch=OFF";
	//var rourl = "http://m.reittiopas.fi/fi/?showsearchformsaved=hide&from_in=" + address;
	return(rourl);
}

function linkToReittopasFrom(address, distance) {
	return(LISTICONLINK + " href='#' onClick=\"window.open('" + urlToReittiopasFrom(address, distance) + "')\" target =' + newWinName() + '>");
}



function showDistance(spanId, d) {
	alert("wait");
	distArea = document.getElementById(spanId);
	alert(spanId + "=" + distArea);
	distArea.innerHTML = d + "km";
}

function showHubs(hubs) {
	var out = "Ei löytynyt";
	if (currentPosition != null) {
		console.log("Sorting hubs by distance");
		calcHubDistances();
		sortHubsByDistance();
	}

	if (hubs.length > 0) {
		out = LISTSTART
		for (var i=0; i<hubs.length; i++) {
			out +=  LISTITEM;
			//out += ' href="#"  onClick="getFacilitiesByHub(\'' + hubs[i].name.fi + '\', ' + hubs[i].location.coordinates[1] + ',' + hubs[i].location.coordinates[0] + ')">';
			out += ' href="#" onClick="showHubDetails(' + i + ')">';
			out += '<h3>' + hubs[i].name.fi + '</h3>';
			if (hubs[i].address.streetAddress != null) {
 				out += '<p> Osoite: ' + hubs[i].address.streetAddress.fi + '</br>';
				out += hubs[i].address.postalCode + " " + hubs[i].address.city.fi;
				out += '<br/>' + hubs[i].distanceFromHere + "km";
				console.log(hubs[i].distanceFromHere);
				out += '</p>';
			}
			//out += linkToGoogleMaps2(hubs[i].location.coordinates);
			out += linkToReittopasFrom(hubs[i].address.streetAddress.fi + "," + hubs[i].address.city.fi, hubs[i].distanceFromHere);
			out += '</a></li>';
		}
		out += '</ul>';
	}
	$('#outarea').html(out);	
}


function timeDiff(tstart, tstop) {
	var tstartDate = new Date(tstart);
	var diff = tstartDate.getTime() - tstop.getTime();
	return(diff);
}

function solveTimeExplanation2(distance, ts) {
	var td = timeDiff(ts, new Date());
	var hm = "";
	var m = Math.trunc(td/60000);
	var h = Math.trunc(td/3600000)
	hm =  h + ":" + (m>=10 ? Math.abs(m) : '0' + Math.abs(m));  // format h:mm
	if (td>=0)
		hm = 'Ennuste ' + hm + ' ';
	else
		hm = '-' + hm + ' sitten ';
	return(hm);
}

function solveTimeExplanation(distance, ts) {
	var t = new Date(ts)
	var m = t.getMinutes();
	m = (m>=10 ? Math.abs(m) : '0' + Math.abs(m));
	var hm = t.getHours() + ":" + m;
	if (t.getTime() > (new Date()).getTime())
		return("P-paikkoja<br/> klo  " + hm + "<br/>n. ");
	else
		return("P-paikkoja<br/> klo  " + hm + "<br/>");
}

function showFacilitiesUtilization(utilization, outId, id, distance) {
	//var s = "";
	var NOCALCULATION = -1;
	var spaces = NOCALCULATION;
	//alert(utilization.length);
	for (var i=0; i<utilization.length; i++) {
	    if ((utilization[i].usage.indexOf("PARK_AND_RIDE") >= 0) || (utilization[i].usage.indexOf("HSL_TRAVEL_CARD")>= 0)) {
	    	/*
	    	spaces = utilization[i].spacesAvailable;
	    	var td = timeDiff(utilization[i].timestamp, new Date());
	    	if (Math.floor(td/3600000) > 0)
		    	spaces = Math.floor(td/3600000) + "h: " + spaces;
		    else if (Math.floor(td/60000) > 0)
		    	spaces = Math.floor(td/60000) + " min: " + spaces;
		    */
		    spaces = solveTimeExplanation(distance, utilization[i].timestamp) + utilization[i].spacesAvailable;
	    }
	}
	if (spaces != NOCALCULATION) {
		spaces = spaces + " /";
		var callBack = "getFacilityUtilization(" + id + ",'" + outId + "'," + distance + ")";
		//alert(spaces + "," + id + "," + outId + "," + callBack);
		if (document.getElementById(outId) != null) // Stop if display updated
			setTimeout(callBack, 60000); // Update count every 60s
	}
	else
		spaces = "P-paikkoja<br/>";
	if (document.getElementById(outId) != null) // Stop if display updated
		document.getElementById(outId).innerHTML = spaces;
	
}

function showFacilityPricing(facility) {
	if (facility.pricingMethod == 'PARK_AND_RIDE_247_FREE')
		return('ilmainen');
	else
		return('maksullinen');
}

/*
"openingHours": {"byDayType": {
"BUSINESS_DAY": 
{"from": "00",
"until": "24"},
"SUNDAY": 
{"from": "00",
"until": "24"},
"SATURDAY": 
{"from": "00",
"until": "24"}},
"info": 
{"fi": "12h kiekko",
"sv": "12h kiekko",
"en": "12h kiekko"},
"url": null}
*/
function solveOpeningTimeNotes(facility) {
	if (facility.openingHours == null)
		return("");
	if (facility.openingHours.info == null)
		return("");
	if (typeof(facility.openingHours.info.fi) != "undefined")
		return("<br/>" + facility.openingHours.info.fi);
	else return("");
}




function showFacilities(facilities) {
	var out = "Ei löytynyt";
	var distance = null;
	if (currentPosition != null) {
		calcDistances();
		sortFacilitiesByDistance();
	}
	if (facilities.length > 0) {
		out = LISTSTART;
		for (var i=0; i<facilities.length; i++) {
		  if (typeof(facilities[i].builtCapacity.CAR) == "number") {
			out += LISTITEM;
			// TODO: haku pitäisi tehdä MULTIPOINT(..), jossa kaikki coordinates arrayn pisteet ja siitä esim. kilometrin säteellä. Nyt hakee yhden kulman mukaan.
			//out += ' href="#"  onClick="getHubsByFacility(\'' +  facilities[i].name.fi + '\',' + facilities[i].location.coordinates[0][1] + ',' + facilities[i].location.coordinates[0][0]  + ')">';
			out += 'href="#" data-transition="slidefade" onClick="showDetails(facilitiesArray[' + i + '])">';
			out += '<h3>' + facilities[i].name.fi + '</h3>';
			
			out += '<p style="padding-right:80px; word-wrap:break-word;">' + solveStatus(facilities[i].status);
			out += ' , ' + solvePriceToday(facilities[i]);
			out += solveOpeningTimeNotes(facilities[i]);
			if (currentPosition != null) {
				distance = facilities[i].distanceFromHere;
				out += '<br/>Etäisyys täältä: ' + distance + "km";
			}
			else
				console.log("currentPosition == null");
			out += "<br/>" + servicesList(facilities[i].services);
	    	out += '<br/>';
	    	//out += 'Hinnoittelu: ' + solvePricing(facilities[i].pricingMethod,facilities[i].pricing);
	    	//console.log("facilities[i].services:" + facilities[i].services);
			out += '</p>';	
	    	
			out += '<p class="ui-li-count">' +
					 '<span id="facility_' + facilities[i].id + '"></span>' + ' ' +
					 facilities[i].builtCapacity.CAR + 
					'</p>';
					
	    	out += '</a>';        
	    	out += linkToMap(getCoordinatesOfFacility(facilities[i]));
			out += '</a></li>';
			getFacilityUtilization(facilities[i].id, 'facility_' + facilities[i].id, distance);
		  }
		}
		out += '</ul>';
	}
	$('#outarea').html(out);	
}
   
function showText(out) {
	$('#outarea').html(out);	
}

function activateFacilityTab() {
	//document.getElementById('stFacs').checked = true;
	//document.getElementById('stHubs').checked = false;
	setFacilitiesSelected();
	//$(".searchType").checkboxradio("refresh");
}

function activateHubTab() {
	//document.getElementById('stFacs').checked = false;
	//document.getElementById('stHubs').checked = true;
	setHubsSelected();
	//$(".searchType").checkboxradio("refresh");
}

var temp= "['one', 'two', 'three']";


function populateRouteList(sel) {
	var $select = $('#route');                        
	//$select.find('option').remove();                          
	for (var i=0; i<routes.length; i++) {
    	$('<option>').val(routes[i].key).text(routes[i].value).appendTo($select);
	};
	console.log("typeof(parseInt(sel))=" + typeof(sel));
	if (typeof(parseInt(sel)) == 'number') {
		console.log("Route " + sel + " selected");
		$select[0].selectedIndex = parseInt(sel);  // NOTE! mystic [0] lisätty, ei toiminut ilman sitä.
		$select.selectmenu("refresh", true);
	}
}

function populateDefaultRouteList(sel) {
	var $select = $('#defaultRoute');                        
	//$select.find('option').remove();                          
	for (var i=0; i<routes.length; i++) {
    	$('<option>').val(routes[i].key).text(routes[i].value).appendTo($select);
	};
	if (typeof(parseInt(sel)) == 'number') {
		console.log("Init route " + sel + " selected");
		$select[0].selectedIndex = parseInt(sel); // NOTE! mystic [0] lisätty, ei toiminut ilman sitä.
		//$select.selectmenu("refresh", true);		
	}
	//$("#defaultRoute").selectmenu('refresh', true);
}



function clearForm() {
	$('#outarea').html("");
	document.forms["f1"].hakuteksti.value = "";
	document.forms["f1"].route.selectedIndex = 0;		
}


var currentFacility = null;
var currentHub = null;

function showFacilityById(facilityId) { // TODO: tee myöhemmin facilitystä assosiatiivinen array
	for (var i=0; i<facilitiesArray.length; i++) {
		if (facilitiesArray[i].id == facilityId) {
			showDetails(facilitiesArray[i])
			return;
		}
	}
}

function showDetails(facility) {
	currentFacility = facility; // pass for links
	var out = "";
	out += "<h2>" + facility.name.fi + "</h2>";
	out += "<p>";
	out += STATUSTXTFI[facility.status] + "<br/>";
	if (facility.pricingMethod.indexOf("IN_OPERATION") >= 0)
		out += "<p>" + facility.statusDescription + "</p>";
	/*out += "Paikkatyypit:<br/>";
	for (object in facility.builtCapacity) {
		out += object.toString() + ":" + facility.builtCapacity[object.toString()] + "<br/>";
	}
	*/
	out += "Aukioloajat ja hinnat:<br/>";
	out += PRICINGFI[facility.pricingMethod] + "<br/>";
	var prevLine1 = "";
	var prevLine2 = "";
	for (var i=0; i<facility.pricing.length; i++) {
		var line = 	CAPACITYTYPES[facility.pricing[i].capacityType] + "<br/>" + 
					USAGES[facility.pricing[i].usage] + " " +
					"max " + facility.pricing[i].maxCapacity + " paikkaa<br/>";
		if (prevLine1 == "")
			out += "<br/>" + line;
		else if (line.indexOf(prevLine1) != 0)
			out += "<br/>" + line;
		prevLine1 = line;
		if (facility.pricingMethod == "CUSTOM") {
			line =  DAYTYPE[facility.pricing[i].dayType] +  " " + 
					facility.pricing[i].time.from + "-" + facility.pricing[i].time.until + " ";
			if (prevLine2 == "")
				out += line;
			else if (line.indexOf(prevLine2) != 0)
				out += line;
			prevLine2 = line;
			out += 	"Hinta: " + (facility.pricing[i].price != null? facility.pricing[i].price.fi : "Ilmainen");
			out += "<br/>";
		}		
	}
	out += (facility.paymentInfo.paymentMethods.length >0 ? "Maksutavat:<br/>": "");
	for (var i=0; i<facility.paymentInfo.paymentMethods.length; i++) {
		out += PAYMENTTYPES[facility.paymentInfo.paymentMethods[i]] + "<br/>";
	}
	out += (facility.paymentInfo.detail != null ? "Lisätietoja:<br/>" + facility.paymentInfo.detail.fi + "<br/>" : "");
	out += (servicesList(facility.services) != ""? "Palvelut:<br/>" + servicesList(facility.services): "");
	out += "</p>";
	$('#explanations').html(out);	
	$.mobile.changePage( "#detail", { transition: "slidefade", changeHash: false });
}

function showHubDetails(i) {
	var hub = hubsArray[i];
	currentHub = hub; // pass for links
	var out = "";
	out += "<h2>" + hub.name.fi + "</h2>";
 	out += '<p> Osoite: ' + hub.address.streetAddress.fi + '</br>';
	out += hub.address.postalCode + " " + hub.address.city.fi;
	out += '<br/>' + hub.distanceFromHere + "km";
	out += '</p>';
	$('#hubexplanations').html(out);	
	$.mobile.changePage( "#hubdetail", { transition: "slidefade", changeHash: false });
}

function listStops() {
	var facility = currentFacility;
	console.log(facility.location.coordinates[0][1] + "," + facility.location.coordinates[0][0]);
	getHubsByFacility(facility.name.fi ,facility.location.coordinates[0][1][0],facility.location.coordinates[0][0][1]);
}

function listFacilities() {
	var hub = currentHub;
	console.log(hub.location.coordinates[1] + "," + hub.location.coordinates[0]);
	getFacilitiesByHub(hub.name.fi ,hub.location.coordinates[1],hub.location.coordinates[0]);
}

function goToGoogleMaps() {
    var facility = currentFacility;
    var gurlbase= "http://maps.google.com/maps?z=12&t=m&q=loc:";  //38.9419+-78.3020
	var coordinates = getCoordinatesOfFacility(facility);
	var url = gurlbase + coordinates[1] + "+" + coordinates[0];
	window.open(url);
}

function goToGoogleMapsHub() {
    var hub = currentHub;
    var gurlbase= "http://maps.google.com/maps?z=12&t=m&q=loc:";  //38.9419+-78.3020
	var coordinates = getCoordinatesOfHub(hub);
	var url = gurlbase + coordinates[1] + "+" + coordinates[0];
	window.open(url);
}

function goToOSM() {
    var facility = currentFacility;
   	var coordinates = getCoordinatesOfFacility(facility);
	var urlbase= "http://www.openstreetmap.org/search?query=";
	var url = urlbase + coordinates[1] + " " + coordinates[0];
   	url += "#map=18/" + coordinates[1] + "/" + coordinates[0];
	window.open(url);
}

function goToOSMHub() {
    var hub = currentHub;
   	var coordinates = getCoordinatesOfHub(hub);
	var urlbase= "http://www.openstreetmap.org/search?query=";
	var url = urlbase + coordinates[1] + " " + coordinates[0];
   	url += "#map=18/" + coordinates[1] + "/" + coordinates[0];
	window.open(url);
}

function gotoHubReittiopas() {
	var hub = currentHub;
	var url = urlToReittiopasFrom(hub.address.streetAddress.fi + "," + hub.address.city.fi, hub.distanceFromHere);
	window.open(url);
}

function gotoFacilityReittiopas() {
	var facility = currentFacility;
	console.log("facility.ports.length:" + facility.ports.length);
	var url = urlToReittiopasFrom(facility.ports[0].address.streetAddress.fi + "," + facility.ports[0].address.city.fi, facility.distanceFromHere);
	window.open(url);	
}
