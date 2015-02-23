    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
            "narrative/:narrative/": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(narrative){

            if (narrative === undefined){

                if (this.applicationVisuals){
                    this.applicationVisuals.remove();
                };
                this.applicationVisuals = new App.Views.ApplicationVisuals();
                return this.applicationVisuals;


            } else {

                console.log(narrative);
                this.applicationVisuals = new App.Views.ApplicationVisuals({
                    visual: narrative
                });
                return this.applicationVisuals;

            }
        },
    });





    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        tag: "div",

        className: "charts",

        initialize: function(visual){

            console.log(arguments.length);

            if (arguments.length === 0){
                var myView = new App.Views.ChartView({
                    container: ".narrative-display",
                    // scatter, line, bar, spline, area, area-spline, pie, donut, gauge
                    chartType: "bar",
                    height: 2000,
                    colorArray: ["#1f77b4", "#2ca02c"],
                    csvData: "data/exit-poll-vote-breakdown.csv",
                    axis_x_label: "",
                    axis_y_label: "Percent of vote",
                    legend: false,
                    rotated: true,
                    labels: true,
                    /*lines: [
                        {value: "40", text: "40 percent"},
                        {value: "50", text: "50 percent"},
                        {value: "60", text: "60 percent"},
                    ]*/
                });

                /*
                this.table = new App.Views.TabularView();
                this.new_chart = new App.Views.ChartView({
                    container: ".bar-plot",
                    // line, bar, spline, area, area-spline, pie, donut, gauge
                    chartType: "bar",
                    height: 2000,
                    colorArray: ["#1f77b4", "#2ca02c"],
                    csvData: "data/exit-poll-age-breakdown.csv",
                    axis_x_label: "",
                    axis_y_label: "Percent of vote",
                    rotated: true,
                    labels: true,
                    legend: true,
                });

                this.scatterPlotChart = new App.Views.ScatterPlotView({
                    container: ".scatter-container",
                });
                */

                this.render(myView);
            } else {

                console.log(visual);
                var myView = new App.Views.TabularView();
                this.render(myView);

            }
        },

        events: {
            "change #narrative-list": "changeNarrative",
        },

        changeNarrative: function(e){
            e.preventDefault();
            var narrative = $("#narrative-list").val().toLowerCase().replace(/ /g, '-').replace(/,/g, '');
            window.app.navigate("#narrative/" + narrative + "/", {
                trigger: true,
                replace: false,
            });
        },

        assign: function (selector, view){
            var selectors;
            if (_.isObject(selector)) {
                selectors = selector;
            } else {
                selectors = {};
                selectors[selector] = view;
            }
            if (!selectors) return;
            _.each(selectors, function (view, selector) {
                var appendSelector = selector.replace(".", "");
                $("#results-display").append("<div class='" + appendSelector + "'></div>");
                view.setElement(this.$(selector)).render();
            }, this);
        },

        render: function(view){

            console.log(view);


            this.$el.html(_.template(this.template));
            this.assign({
                ".narrative-display": view,

                //".voting-age-container": this.table,
                //".bar-plot": this.new_chart,
                //".scatter-container": this.scatterPlotChart,


            });
            return this;
        }
    });











    App.Views.TabularView = Backbone.View.extend({
        template: template("templates/table-visuals.html"),
        el: "#table-container",
        initialize: function(){},
        render: function(){
            this.$el.html(_.template(this.template));
            $(".kpcc-table").each(function(){
                $("tbody tr").each(function(){
                    $(this).find("td").each(function(){
                        var myLabel = $(this).index() + 1;
                        myLabel = $(this).closest("table").find("thead th:nth-child(" + myLabel + ")").text();
                        $(this).prepend("<mark>" + myLabel + "</mark>");
                    });
                });
            });
            return this;
        }
    });






    App.Views.ChartView = Backbone.View.extend({
        template: template("templates/scatter-visuals.html"),
        el: "#chart-container",
        initialize: function(options){
            this.buildChart(options);
        },
        buildChart: function(options){
            var chart = c3.generate({
                bindto: options.container,
                size: {
                    height: options.height
                },
                color: {
                    pattern: options.colorArray
                },
                legend: {
                    show: options.legend
                },
                data: {
                    x: "x",
                    url: options.csvData,
                    type: options.chartType,
                    onclick: function (d, i){
                        console.log(i);
                    },
                    labels: options.labels,
                },
                axis: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        max: 100,
                        min: 0,
                        tick: {
                            count: 5
                        },
                      },
                    rotated: options.rotated,
                },
                grid: {
                    x: {
                        show: false
                    },
                    y: {
                        show: false,
                        lines: options.lines
                    }
                },
            });
        },

        render: function(){
            this.$el.html(_.template(this.template));
            return this;
        }
    });













App.Views.ScatterPlotView = Backbone.View.extend({

    template: template("templates/scatter-visuals.html"),

    el: "#scatter-container",

    initialize: function(){

    },

    testChart: function(){

        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };

        var width = 960 - margin.left - margin.right;

        var height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .domain([.05, .95])
            .range([0, width]);

        var y = d3.scale.linear()
            .range([0, height]);

        var svg = d3.select(".test-scatter")
            .append("svg:svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
            .attr("class", "grid-background")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).ticks(20).tickSize(-height))
            .selectAll(".tick")
            .data(x.ticks(10), function(d) { return d; })
            .exit()
            .classed("minor", true);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).ticks(10));


        /*
        var leftScale = d3.scale.linear()
            .domain([-1, 1])
            .range([0, 750]);

        var rightScale = d3.scale.linear()
            .domain([0, 1])
            .range([650, 0]);

        var xAxis = d3.svg.axis()
            .scale(rightScale);

        var xAxisGroup = svg.append("svg:g")
            .call(xAxis);
        */






    },




    // old function
    buildChart: function(){

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */

        // setup x
        var xValue = function(d) { return d.Calories;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) { return d["Protein (g)"];}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

        // setup fill color
        var cValue = function(d) { return d.Manufacturer;},
            color = d3.scale.category10();

        // add the graph canvas to the body of the webpage
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // load data
        d3.csv("data/exit-poll-vote-breakdown.csv", function(error, data) {


            console.log(data);

          // change string (from CSV) into number format
          data.forEach(function(d) {
            d.Calories = +d.Calories;
            d["Protein (g)"] = +d["Protein (g)"];
            console.log(d);
          });

          // don't want dots overlapping axis, so add in buffer to data domain
          xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
          yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

          // x-axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Calories");

          // y-axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Protein (g)");

          // draw dots
          svg.selectAll(".dot")
              .data(data)
            .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .style("fill", function(d) { return color(cValue(d));})
              .on("mouseover", function(d) {
                  tooltip.transition()
                       .duration(200)
                       .style("opacity", .9);
                  tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
                       .style("left", (d3.event.pageX + 5) + "px")
                       .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", function(d) {
                  tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
              });

          // draw legend
          var legend = svg.selectAll(".legend")
              .data(color.domain())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          // draw legend colored rectangles
          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

          // draw legend text
          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;})
        });

    },





    render: function(){
        this.$el.html(_.template(this.template));
        this.testChart();
        return this;
    }

});

