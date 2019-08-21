// Creating map object
var map = L.map("map", {
  center: [38.7128, -95.0059],
  zoom: 5
});


const API_KEY = "pk.eyJ1IjoibmRhZGFtcyIsImEiOiJjanl2dG5iMjQwZmFjM2xvYjJ2Zjg3bGl5In0.HHo2VIFlzJWE1_spVxVcDg";


// Adding tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(map);


	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>US Voter Turnout by State</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.density + '% of people voted' + '</b><br />' + props.male + ' % of Men voted' + '</b><br />' + props.female + ' % of Women voted' + '</b><br />' + props.white + ' % of White people voted' + '</b><br />' + props.black + ' % of Black people voted' + '</b><br />' + props.asian  + ' % of Asian people voted'
			: 'Hover over a state');
	};

	info.addTo(map);


	// get color depending on voter turnout
	function getColor(d) {
		return d > 1000 ? '#800026' :
				d > 500  ? '#BD0026' :
				d > 200  ? '#E31A1C' :
				d > 100  ? '#FC4E2A' :
				d > 50   ? '#FD8D3C' :
				d > 20   ? '#FEB24C' :
				d > 10   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau - 2018 Midterm Election Data</a>');


	// var legend = L.control({position: 'bottomright'});

	// legend.onAdd = function (map) {

	// 	var div = L.DomUtil.create('div', 'info legend'),
	// 		grades = [0, 20, 30, 40, 50, 60, 70],
	// 		labels = [],
	// 		from, to;

	// 	for (var i = 0; i < grades.length; i++) {
	// 		from = grades[i];
	// 		to = grades[i + 1];

	// 		labels.push(
	// 			'<i style="background:' + getColor(from + 1) + '"></i> ' +
	// 			from + (to ? '&ndash;' + to : '+'));
	// 	}

	// 	div.innerHTML = labels.join('<br>');
	// 	return div;
	// };

	// legend.addTo(map);
