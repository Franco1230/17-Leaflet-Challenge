// Setting backgrounds of our map - tile layer:
// grayscale background.
var lightMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/light-v10',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY});


// map object to an array of layers we created.
var map = L.map("map", {
  center: [25, 0],
  zoom: 2,
});

// adding 'graymap' tile layer to the map.
lightMap.addTo(map);

var earthquakes = new L.LayerGroup();


var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// retrieve earthquake geoJSON data.
d3.json(queryURL, function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Define the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#f06b6b";
      case magnitude > 4:
        return "#f0a76b";
      case magnitude > 3:
        return "#f3ba4d";
      case magnitude > 2:
        return "#f3db4d";
      case magnitude > 1:
        return "#e1f34d";
      default:
        return "#b7f34d";
    }
  }

  // define the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);

  // Creating Legend Layer
  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
   
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#b7f34d",
      "#e1f34d",
      "#f3db4d",
      "#f3ba4d",
      "#f0a76b",
      "#f06b6b"
     ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Adding Legend to the map
  legend.addTo(map);

});