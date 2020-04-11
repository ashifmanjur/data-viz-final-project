import * as d3 from 'd3';
import * as topojson from 'topojson';


$(document).on("turbolinks:load", function() {
    function mouseover(d) {
        mapLabel.text(d.properties.name.slice(0,-5)) // remove suffix id from name
    }

    function mouseout(d) {
        mapLabel.text("")  // remove out name
    }

    function clicked(d) {
        console.log(d.properties.id, d.properties.name) // verify everything looks good
        // Add code here
    }

    // With help from - http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
    var mapWidth = 550,
        mapHeight = 550;

    var projection = d3.geoAlbers();

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(".wrapper").append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    var mapLabel = svg.append("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("class", "map_neighbourhood_name");

// load TopoJSON file
    d3.json("data/toronto_topo.json").then(function(toronto) {
        var neighbourhoods = topojson.feature(toronto, toronto.objects.toronto);

        // set default projection values
        projection
            .scale(1)
            .translate([0, 0]);

        // creates bounding box and helps with projection and scaling
        var b = path.bounds(neighbourhoods),
            s = .95 / Math.max((b[1][0] - b[0][0]) / mapWidth, (b[1][1] - b[0][1]) / mapHeight),
            t = [(mapWidth - s * (b[1][0] + b[0][0])) / 2, (mapHeight - s * (b[1][1] + b[0][1])) / 2];

        // set project with bounding box data
        projection
            .scale(s)
            .translate(t);

        // get individual neighbourhoods
        svg.selectAll("path")
            .data(neighbourhoods.features)
            .enter().append("path")
            .attr("class", "map_neighbourhood")
            .attr("d", path)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", clicked)

        // add the mesh/path between neighbourhoods
        svg.append("path")
            .datum(topojson.mesh(toronto, toronto.objects.toronto, function(a, b) { return a !== b; }))
            .attr("class", "map_mesh")
            .attr("d", path);

    });
});
