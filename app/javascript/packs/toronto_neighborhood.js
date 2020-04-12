import "leaflet";

$(document).on("turbolinks:load", function() {
    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map').setView([43.653908, -79.384293], 10);

    // add an OpenStreetMap tile layer
    var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    tile.addTo(map);

    $.getJSON('data/toronto_neighbourhoods.geojson', function(data) {
        var geo = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<a href="/neighbourhoods/'+ feature.properties.AREA_LONG_CODE +'">' + feature.properties.AREA_NAME + '</a>');
            },
            style: {
                "color": "#1f77b4",
                "weight": 1,
                "opacity": 0.65
            }
        });

        geo.addTo(map);
    });
});
