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
                    {name: "Blue", data: [0.94, 1.16, 3.36, 2.35,2.23]},
                    {name: "Gold", data: [0.62,0.35,0.83,1.41,0.80]},
                    {name:"Expo", data: [0,0,0.94,0.71,0.63]},
                    {name:"Red/Purple", data: [0.41,0.26,0.46,0.66,0.74]},
                    {name:"Green", data: [0.47,0.45,1.16,1.51,1.89]}
                ]
            };


            new Chartist.Line(".ct-chart", data, options);

            var $chart = $('.ct-chart');

            var $tooltip = $('<div class="tooltip tooltip-hidden"></div>').appendTo($('.ct-chart'));
             
            $(document).on('mouseenter', '.ct-point', function() {
              var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
                  value = $(this).attr('ct:value');
              
              $tooltip.text(seriesName + ': ' + value +'%');
              $tooltip.removeClass('tooltip-hidden');
            });

            $(document).on('mouseleave', '.ct-point', function() {
              $tooltip.addClass('tooltip-hidden');
            });

            $(document).on('mousemove', '.ct-point', function(event) {
              console.log(event);
              $tooltip.css({
                left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
                top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
              });
            });

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

                    // we can but don't want to disable the grid for this axis
                    showGrid: true,

                    // and also 't show the label
                    showLabel: true
                },

                // y-axis specific configuration
                axisY: {

                    // lets offset the chart a bit from the labels
                    offset: 60,

                    // the label interpolation function enables you to modify the values
                    // used for the labels on each axis.
                    labelInterpolationFnc: function(value) {
                        return value +  " %";
                    }
                }
            };
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