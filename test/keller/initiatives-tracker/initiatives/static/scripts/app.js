    var w = 400, //width
        h = 400, //height
        r = 180, //radius
        pi = Math.PI,
        color = d3.scale.category20c();
        //border = 5,
        outerRadius = w / 2 - 5,
        innerRadius = w / 3,
        data = [
            {"value": chartConfig.support_percent},
            {"value": chartConfig.oppose_percent}
        ];

    console.log(outerRadius);
    console.log(innerRadius);

    var vis = d3.select(".chart-container")
        .append("svg:svg") //create the SVG element inside the <body>
        .data([data]) //associate our data with the document
        .attr("width", w) //set the width and height of our visualization
        .attr("height", h)
        .append("svg:g") //make a group to hold our pie chart
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

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

        /*
        arcs.append("svg:text")
            .attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function(d, i){
                return data[i].label;
            });
        */