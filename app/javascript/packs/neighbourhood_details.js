import * as d3 from 'd3';

$(document).ready(function() {
    const neighbourhoodId = $("#neighboorhood-id-container").data("nid");
    console.log(neighbourhoodId);

    d3.csv("/data/unemployment-2.csv").then(function(data) {
        var margin = {top: 20, right: 30, bottom: 30, left: 40};
        var height = 1000;
        var width = 1400;

        // console.log(series);
        const svg = d3.select("#stacked-line-chart")
            .attr("viewBox", [0, 0, width, height]);

        var series = d3.stack().keys(data.columns.slice(1))(data);

        var color = d3.scaleOrdinal()
            .domain(data.columns.slice(1))
            .range(d3.schemeCategory10);

        var x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top]);

        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        var area = d3.area()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", ({key}) => color(key))
            .attr("d", area)
            .append("title")
            .text(({key}) => key);
    });



//     // STACKED LINE CHART
//     // set the dimensions and margins of the graph
//     var margin = {top: 10, right: 30, bottom: 30, left: 60},
//         width = 1400 - margin.left - margin.right,
//         height = 1000 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
//     var svg_area_chart = d3.select("#stacked-line-chart")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");

//Read the data
//     d3.csv("/data/unemployment-2.csv").then(function(data) {
//         // group the data: one array for each value of the X axis.
//         var sumstat = d3.nest()
//             .key(function(d) { return d.year;})
//             .entries(data);
//         console.log(data);
//         // Stack the data: each group will be represented on top of each other
//         var mygroups = ["Helen", "Amanda", "Ashley"]; // list of group names
//         var mygroup = [1,2,3]; // list of group names
//         var stackedData = d3.stack()
//             .keys(mygroup)
//             .value(function(d, key){
//                 return d.values[key].n
//             })(sumstat);
//
//         console.log(stackedData);
//
//         // Add X axis --> it is a date format
//         var x = d3.scaleLinear()
//             .domain(d3.extent(data, function(d) { return d.year; }))
//             .range([ 0, width ]);
//         svg_area_chart.append("g")
//             .attr("transform", "translate(0," + height + ")")
//             .call(d3.axisBottom(x).ticks(5));
//
//         // Add Y axis
//         var y = d3.scaleLinear()
//             .domain([0, d3.max(data, function(d) { return +d.n; })*1.2])
//             .range([ height, 0 ]);
//         svg_area_chart.append("g")
//             .call(d3.axisLeft(y));
//
//         // color palette
//         var color = d3.scaleOrdinal()
//             .domain(mygroups)
//             .range(['#abdfeb', '#f2d268', '#4daf4a', '#f3e5af', '#a7d37c', '#377eb8','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);
//
//         // Show the areas
//         svg_area_chart.selectAll("mylayers")
//             .data(stackedData)
//             .enter()
//             .append("path")
//             .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
//             .attr("d", d3.area()
//                 .x(function(d, i) { return x(d.data.key); })
//                 .y0(function(d) { return y(d[0]); })
//                 .y1(function(d) { return y(d[1]); })
//             )
//
//         //////////
//         // LEGEND //
//         //////////
//
//         // Example taken from https://www.d3-graph-gallery.com/graph/custom_legend.html //
//
// // Add one dot in the legend for each name.
//         var size = 20
//         svg_area_chart.selectAll("mydots")
//             .data(mygroups)
//             .enter()
//             .append("rect")
//             .attr("x", 100)
//             .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//             .attr("width", size)
//             .attr("height", size)
//             .style("fill", function(d){ return color(d)})
//
// // Add one dot in the legend for each name.
//         svg_area_chart.selectAll("mylabels")
//             .data(mygroups)
//             .enter()
//             .append("text")
//             .attr("x", 100 + size*1.2)
//             .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//             .style("fill", function(d){ return color(d)})
//             .text(function(d){ return d})
//             .attr("text-anchor", "left")
//             .style("alignment-baseline", "middle")
//     })

    // // PIE CHART
    // // Followed example from https://www.d3-graph-gallery.com/graph/pie_annotation.html
    // var width = 800;
    // var height = 800;
    // var margin = 80;
    //
    //
    // const data = [
    //     {"activity":"Sleep", "vote_count":8},
    //     {"activity":"School", "vote_count":6},
    //     {"activity":"Playing", "vote_count":2},
    //     {"activity":"Study", "vote_count":4},
    //     {"activity":"T.V.", "vote_count":1},
    //     {"activity":"Others", "vote_count":3}
    // ];
    //
    // const total_vote_count = 24;
    //
    // var svg_pie = d3.select("#pie-chart")
    //     .attr("width", width)
    //     .attr("height", height);
    //
    // var radius = Math.min(width, height) / 2 - margin;
    //
    // var g = svg_pie.append("g")
    //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //
    // var color = d3.scaleOrdinal(['#4daf4a','#e41a1c','#377eb8','#ff7f00','#984ea3','#a86232']);
    //
    // var pie = d3.pie().value(function(d) {
    //     return d.vote_count;
    // });
    //
    // var path = d3.arc()
    //     .outerRadius(radius)
    //     .innerRadius(0);
    //
    // var outerLabel = d3.arc()
    //     .outerRadius(radius)
    //     .innerRadius(240);
    //
    // var innerLabel = d3.arc()
    //     .outerRadius(radius - 40)
    //     .innerRadius(100);
    //
    // var arc = g.selectAll(".arc")
    //     .data(pie(data))
    //     .enter().append("g")
    //     .attr("class", "arc");
    //
    // function angle(d) {
    //     var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    //     return a > 90 ? a - 180 : a;
    // }
    //
    // arc.append("path")
    //     .attr("d", path)
    //     .attr("fill", function(d) { return color(d.data.activity); });
    //
    // arc.append("text")
    //     .attr("transform", function(d) {
    //         return "translate(" + outerLabel.centroid(d) + ")";
    //     })
    //     .text(function(d) { return `${d.data.activity}` });
    //
    // arc.append("text")
    //     .attr("transform", function(d) {
    //         return "translate(" + innerLabel.centroid(d) + ")rotate(" + angle(d) + ")";
    //     })
    //     .text(function(d) { return `${((d.data.vote_count*100)/total_vote_count).toFixed(1)}%` });

});