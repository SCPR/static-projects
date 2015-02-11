    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };

            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });

            return this.applicationVisuals;

        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));

            var svg = dimple.newSvg("#chartContainer", 700, 400);

            d3.csv("data/rail-ontime-performance.csv", function (data) {
                var myChart = new dimple.chart(svg, data);
                myChart.setBounds(90, 30, 615, 305);
                var x = myChart.addCategoryAxis("x", "Year");
                x.addOrderRule("Date");
                var y = myChart.addMeasureAxis("y", "Percentage of trains that arrived late");
                var s = myChart.addSeries("Line", dimple.plot.line);
                s.interpolation = "cardinal";
                myChart.addLegend(60, 10, 615, 20, "right");
                myChart.assignColor("Blue", "#0072bb");
                myChart.assignColor("Gold", "#ffb715");
                myChart.assignColor("Green", "#6cc06b");
                myChart.assignColor("Red/Purple", "#ea1d24");
                myChart.assignColor("EXPO", "#01a4e5");
                myChart.draw();
                x.titleShape.style("font-size", "13px");
                y.titleShape.style("font-size", "13px");
            });
        }

    });