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
        }
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),
        el: ".data-visuals",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        drawChart: function(){

            var data = {
                // a labels array that can contain any sort of values
                labels: ["2010", "2011", "2012", "2013", "2014"],

                // our series array that contains series objects or in this case series data arrays
                series: [
                    {name: "Blue", data: [0.943745802, 1.159244835, 3.359141299, 2.347333308,2.234413863]},
                    {name: "Gold", data: [0.621658231,0.354086751,0.836737707,1.413523425,0.808481654]},
                    {name:"Expo", data: [0,0,0.938836215,0.713218023,0.633092701]},
                    {name:"Red/Purple", data: [0.406598775,0.255049388,0.454982711,0.654698233,0.736225515]},
                    {name:"Green", data: [0.470150283,0.451894641,1.161451334,1.509439136,1.890563468]}
                ]
            };

            // we are setting a few options for our chart and override the defaults
            var options = {

                // line chart points
                showPoint: true,

                // line smoothing
                lineSmooth: true,

                // overriding the natural low of the chart
                low: 0,

                // overriding the natural high of the chart allows you to zoom
                high: undefined,

                // x-axis specific configuration
                axisX: {

                    // we can disable the grid for this axis
                    showGrid: true,

                    // and also don't show the label
                    showLabel: true
                },

                // y-axis specific configuration
                axisY: {

                    // lets offset the chart a bit from the labels
                    offset: 60,

                    // the label interpolation function enables you to modify the values
                    // used for the labels on each axis. here we are converting the
                    // values into million pound.
                    labelInterpolationFnc: function(value) {
                        return value +  " rgpcd";
                    }
                }
            };

            new Chartist.Line(".ct-chart", data, options);

            var $chart = $('.ct-chart');

            var $toolTip = $chart
                .append('<div class="tooltip"></div>')
                .find('.tooltip')
                .hide();

            $chart.on('mouseenter', '.ct-point', function(){
                var $point = $(this),
                    value = $point.attr('ct:value'),
                    seriesName = $point.parent().attr('ct:series-name');
                    $toolTip.html(seriesName + '<br>' + value).show();
            });

            $chart.on('mouseleave', '.ct-point', function() {
                $toolTip.hide();
            });

            $chart.on('mousemove', function(event) {
                $toolTip.css({
                    left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
                    top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
                });
            });

        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            //this.chartContainerWidth = document.getElementById("chartContainer").offsetWidth;
            //this.chartContainerHeight = this.chartContainerWidth / 1.75;
            //this.drawChart(this.chartContainerWidth, this.chartContainerHeight);

            this.drawChart();

            /*
            $(window).resize(function(){
                this.chartContainerWidth = document.getElementById("chartContainer").offsetWidth;
                this.chartContainerHeight = this.chartContainerWidth / 1.75;
                console.log(this.chartContainerWidth + this.chartContainerHeight);
            });
            */

        }
    });