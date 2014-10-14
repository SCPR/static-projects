    var w = 400, //width
        h = 420, //height
        r = 180, //radius
        pi = Math.PI,
        //color = d3.scale.category20c();
        //border = 5,
        outerRadius = w / 2 - 10,
        innerRadius = w / 3,
        data = [
            {"value": chartConfig.support_percent},
            {"value": chartConfig.oppose_percent}
        ];

    var color = d3.scale.ordinal()
        .domain(["one","two"])
        .range(["#B4DD0A", "#66D8D8"]);

    var vis = d3.select(".chart-container")
        .append("svg:svg")
        .data([data])
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox','0 0 '+Math.min(w, h) + ' ' + Math.min(w, h))
        .attr('preserveAspectRatio','xMinYMin')
        .append("svg:g")
        .attr("transform", "translate(" + Math.min(w, h) / 2 + "," + Math.min(w, h) / 2 + ")");

    /*
    var vis = d3.select(".chart-container")
        .append("svg:svg")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
    */

    var arc = d3.svg.arc() //this will create <path> elements for us using arc data
        .outerRadius(r);

    var arcBorder = d3.svg.arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius + 10);

    var spaceBorder = d3.svg.arc()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius);

    var pie = d3.layout.pie()
        .value(function(d){
            return d.value;
        })
        .startAngle(chartConfig.start_angle * (pi/180))
        .endAngle(chartConfig.end_angle * (pi/180));

    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie) //array of arcs, each having startAngle, endAngle and value properties
        .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i){
                return color(i);
            }) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc); //creates SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:path")
            .attr("fill", "#999999")
            .attr("d", arcBorder);

        arcs.append("svg:path")
            .attr("fill", "#ffffff")
            .attr("d", spaceBorder);