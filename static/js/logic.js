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
			'<b>' + props.name + '</b><br />' + props.density + '% of people voted' + '</b><br />' + "-------------------------------------"+'</b><br />' + props.male + '% of Men voted' + '</b><br />' + props.female + '% of Women voted' + '</b><br />' + "-------------------------------------"+ '</b><br />' + props.white + '% of White people voted' + '</b><br />' + props.black + '% of Black people voted' + '</b><br />' + props.asian  + '% of Asian people voted'
			: 'Hover over a state');
	};

	info.addTo(map);


	// get color depending on voter turnout
	function getColor(d) {
		return d > 63 ? '#023858' :
				d > 61  ? '#045a8d' :
				d > 58  ? '#0570b0' :
				d > 55  ? '#3690c0' :
				d > 52  ? '#74a9cf' :
				d > 50  ? '#a6bddb' :
				d > 49   ? '#d0d1e6' :
							'#ece7f2';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'grey',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			color: 'black',
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

	map.attributionControl.addAttribution('Population data &copy; <a href="https://www.census.gov/data/tables/time-series/demo/voting-and-registration/p20-583.html">US Census Bureau - 2018 Midterm Election Data</a>');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0,49, 50, 52, 55, 58, 61, 63],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
