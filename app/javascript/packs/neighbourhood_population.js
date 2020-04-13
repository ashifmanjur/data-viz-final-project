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
                d >= 0.6 ? '#BD0026' :
                d >= 0.4 ? '#E31A1C' :
                d >= 0.3 ? '#FC4E2A' :
                d >= 0.2 ? '#FD8D3C' :
                d >= 0.1 ? '#FEB24C' :
                d >= 0.05 ? '#FED976' :
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

    $.getJSON('data/toronto_neighbourhood_population.geojson', function(data) {
        var geo = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<h5><a href="/demographics/'+ feature.properties.Hood_ID +'">' +
                    feature.properties.Area_Name + '</a></h5>' +
                    'Total Population: <b>' + feature.properties.Population_Size.toString() + '</b><br />' +
                    'Density (people/km<sup>2</sup>): <b>' + feature.properties.Population_Density.toFixed(2) + '</b><br />' +
                    '<i>Census 2016</i>'
                );
            },
            style: style
        });

        geo.addTo(map);
    });
});
