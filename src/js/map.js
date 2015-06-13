// Copyright © 2015 Konsultointi Ari Vainio Oy http://www.arivain.com
// Source code for this program is dual-licensed under the EUPL v1.2 and AGPLv3 licenses.

var map;
var buttonId;
var buttonCallback;


function parseJSON(geoJsonURL) {
	loadJSON(geoJsonURL, function(response) {
		// Parse JSON string into object
		var actual_JSON = JSON.parse(response);
	});
}


function loadJson(geoJsonSource, callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', geoJsonSource, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function initMap(mapdiv) {
	createMap(mapdiv); // Vaihdoin divin nime
}

function loadMap(geoJsonSource, imgSource, callback) {
	// loadJson(geoJsonSource, function(response) {
		// var geoJson = JSON.parse(response);
		// addFeatureLayer(geoJson, imgSource);
	// });
	console.log("creating feature layer");
	addFeatureLayer(geoJsonSource, imgSource, callback);
}

function createMap(mapDiv) {
	map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		target: mapDiv,
		view: new ol.View({
			center: [2763762.2075404185, 8449133.630492318],
			zoom: 10
		})
	});
}

function transformProjection(geoJson, targetProjection) {
	for (var i = 0; i < geoJson.features.length; i++) {
		if (geoJson.features[i].geometry.type === 'Point') {
			geoJson.features[i].geometry.coordinates =
			ol.proj.transform(
				geoJson.features[i].geometry.coordinates,
				//geoJson.crs.properties.name,
				geoJson.features[i].geometry.crs.properties.name,
				targetProjection
			);
		} else {
			for (var j = 0; j < geoJson.features[i].geometry.coordinates.length; j ++) {
				geoJson.features[i].geometry.coordinates[j] =
				ol.proj.transform(
					geoJson.features[i].geometry.coordinates[j],
					//geoJson.crs.properties.name,
					geoJson.features[i].geometry.crs.properties.name,
					targetProjection
				);
			}
		}
		//geoJson.features[i].geometry.crs.properties.name = targetProjection;
	}
	//geoJson.crs.properties.name = targetProjection;
	return geoJson;
}

function addFeatureLayer(geoJson, imgSource, callback) {
	console.log("transforming projection");
	// geoJson = transformProjection(geoJson, 'EPSG:3857');
	
	console.log("adding IDs");
	addId(geoJson.features);
	
	console.log("starting source creation");
	
	vectorSource = createFeatures(geoJson, imgSource);
	
	var vectorLayer = new ol.layer.Vector({
		//style: styleFunction,
		source: vectorSource
	});
	console.log("source creation finished");
	
	map.addLayer(vectorLayer);
	
	vectorSource.on('change', function(evt) {
		var src = evt.target;
		if (src.getState() === 'ready') {
			map.getView().fitExtent(src.getExtent(), map.getSize());
		}
	})
	
	
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	
	createPopupOverlay(container, content, callback);
}

function createFeatures(geoJson, imgSource) {
	var styles = {
		'Point': [new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 32],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src: imgSource
			})
		})],
		'Polygon': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'blue',
				width: 3
			}),
			fill: new ol.style.Fill({
				color: 'rgba(0, 0, 255, 0.2)'
			}),
			image: new ol.style.Icon({
				anchor: [0.5, 32],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: imgSource
			})
		})],
	};
	
	// var styleFunction = function(feature, resolution) {
		// console.log("getting style");
		
		// console.log("asdf");
		// return styles[feature.getGeometry().getType()];
	// };
	
	vectorSource = new ol.source.Vector();
	
	for (var i = 0; i < geoJson.features.length; i++) {
		format = new ol.format.GeoJSON();
		
		var feature = format.readFeature(geoJson.features[i], {
			featureProjection: 'EPSG:3857'
		});
		
		feature.setStyle(styles[geoJson.features[i].geometry.type]);
		console.log(geoJson.features[i].geometry.type + " found");
		
		vectorSource.addFeature(feature);
		
		if (feature.getGeometry().getType() !== 'Point') {
			center = ol.extent.getCenter(feature.getGeometry().getExtent());
						
			iconFeature = feature.clone();
			iconFeature.setGeometry(new ol.geom.Point(center));
			
			iconFeature.setStyle(styles['Point']);
			vectorSource.addFeature(iconFeature);
		}
	}
	
	return vectorSource;
}

function createPopupOverlay(container, content, callback) {
	
	var popup = new ol.Overlay({
		element: container,
		positioning: 'bottom-center',
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
	
	map.addOverlay(popup);
	
	// display popup on click
	map.on('click', function(evt) {
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
			return feature;
		});
		if (feature) {
			if (feature.getGeometry().getType() === 'Point') {
				var fId = feature.get('id');
				showFacilityById(fId);
				/*
				var geometry = feature.getGeometry();
				var coord = geometry.getCoordinates();
				popup.setPosition(coord);

				buttonId = feature.get('id');
				buttonCallback = callback;

				// var buttonAction = callback(feature.get('id'));

				content.innerHTML =
					'<h2>' + feature.get('name').fi + '</h2>' + '<br />' +
					'<p>' + feature.get('status') + '</p>' +
					'<p> Max paikkoja: ' + feature.get('builtCapacity').CAR + '</p>' +
					'<a href="#" id="popup-button" class="ui-btn ui-shadow ui-icon-carat-r ui-btn-icon-right" onclick="buttonAction()">test</a>';
				*/
			}
		} else {
			popup.setPosition(undefined);
		}
	});
}

function buttonAction() {
	buttonCallback(buttonId);
}

// function buttonAction(id, callback) {
	// this.id = id;
	// this.action = callback;
// }

function addId(features) {
	for (var i = 0; i < features.length; i++) {
		if (features[i].id === undefined) {
			features[i].properties.id = i;
		} else {
			features[i].properties.id = features[i].id;
		}
	}
	return features;
}

function removeFearureLayer() {
	if (typeof(map) != 'undefined') {
		if (map.getLayers().getLength() >= 2)
			map.getLayers().pop();
	}
}
