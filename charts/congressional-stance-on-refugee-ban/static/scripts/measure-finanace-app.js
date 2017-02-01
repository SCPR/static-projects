    $(window).load(function() {
        if (Modernizr.svg) { // if svg is supported, draw dynamic chart
            var chartContainerWidth = $("#chart-container").width() / 2;
            var chartContainerHeight = $("#chart-container").height();
            drawGraphic(chartContainerWidth, chartContainerHeight);
            window.onresize = function(){
                $graphic.empty();
                var chartContainerWidth = $("#chart-container").width() / 2;
                var chartContainerHeight = $("#chart-container").height();
                drawGraphic(chartContainerWidth, chartContainerHeight);
            };
        }
    });

    var $graphic = $("#chart-container");

    function drawGraphic(w, h) {
        var pi = Math.PI,
            //w = 100, //width
            //h = 100, //height
            //r = 100, //radius
            //color = d3.scale.category20c();
            //border = 5,
            //outerRadius = w / 1,
            //innerRadius = w / 3,

            data = [
                {"value": chartConfig.support_percent},
                {"value": chartConfig.oppose_percent}
            ];

        $graphic.empty();

        var color = d3.scale.ordinal()
            .domain(["one","two"])
            .range(["#f4f30f", "#3bdaef"]);

        var vis = d3.select("#chart-container")
            .append("svg:svg")
            .data([data])
            .attr("width", "100%")
            .attr("height", "100%")

            //.attr('viewBox','0 0 '+Math.min(w, h) + ' ' + Math.min(w, h))
            //.attr('preserveAspectRatio','xMinYMin')
            //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            //.attr("transform", "translate(" + Math.min(w, h) / 2 + "," + Math.min(w, h) / 2 + ")");
            //.attr("transform", "translate(200, 200)");

            .append("svg:g")
            .attr("transform", "translate(" + w + "," + h + ")")

        var arc = d3.svg.arc() //this will create <path> elements for us using arc data
            .outerRadius(w - 5);

        var innerNugget = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(10);

        var spaceBorder = d3.svg.arc()
            .innerRadius(w - 20)
            .outerRadius(w - 10);

        var arcBorder = d3.svg.arc()
            .innerRadius(w - 10)
            .outerRadius(w);

        var pie = d3.layout.pie()
            .value(function(d){
                return d.value;
            })
            .startAngle(chartConfig.start_angle * (pi / 180))
            .endAngle(chartConfig.end_angle * (pi / 180));

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
                .append("svg:g")
                .attr("class", "slice");

            arcs.append("svg:path")
                .attr("fill", function(d, i){
                    return color(i);
                })
                .attr("d", arc);

            arcs.append("svg:path")
                .attr("fill", "#ffffff")
                .attr("d", innerNugget);

            arcs.append("svg:path")
                .attr("fill", "#ffffff")
                .attr("d", spaceBorder);

            arcs.append("svg:path")
                .attr("fill", "#999999")
                .attr("d", arcBorder);
    }
