import "leaflet";

$(document).ready(function() {
    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map').setView([43.721111, -79.377778], 11);

    // add an OpenStreetMap tile layer
    var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    tile.addTo(map);

    function getColor(d) {
        return  d >= 0.8 ? '#800026' :
                d >= 0.7 ? '#BD0026' :
                d >= 0.6 ? '#E31A1C' :
                d >= 0.4 ? '#FC4E2A' :
                d >= 0.3 ? '#FD8D3C' :
                d >= 0.2 ? '#FEB24C' :
                d >= 0.1 ? '#FED976' :
                '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.Normalized_Value),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    $.getJSON('data/toronto_neighbourhoods.geojson', function(data) {
        var geo = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<h5><a href="/neighbourhoods/'+ feature.properties.Hood_ID +'">' +
                    feature.properties.Area_Name + '</a></h5>' +
                    '<b>Average Crime (Annual): ' + feature.properties.Crime_Count_Sum.toFixed(2) + '</b><br />' +
                    '<i>2014 - 2019</i>');
            },
            style: style
        });

        geo.addTo(map);
    });
});
