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
<<<<<<< HEAD:test/keller/in-development/metro-on-time-performance/rail-performance/scripts/app.js
                    {name: "Blue", data: [0.94, 1.16, 3.36, 2.35,2.23]},
                    {name: "Gold", data: [0.62,0.35,0.83,1.41,0.80]},
                    {name:"Expo", data: [0,0,0.94,0.71,0.63]},
                    {name:"Red/Purple", data: [0.41,0.26,0.46,0.66,0.74]},
                    {name:"Green", data: [0.47,0.45,1.16,1.51,1.89]}
                ]
            };


            new Chartist.Line(".ct-chart", data, options);
=======
                    {name: "Blue Line", data: [0.94, 1.16, 3.36, 2.35,2.23]},
                   {name: "Gold Line", data: [0.62, 0.35, 0.83, 1.41, 0.80]},
                   {name:"Expo Line", data: [0, 0, 0.94, 0.71, 0.63]},
                   {name:"Red & Purple Lines", data: [0.41, 0.26, 0.46, 0.66, 0.74]},
                   {name:"Green Line", data: [0.47, 0.45, 1.16, 1.51, 1.89]}
                ]
            };

            var chart = new Chartist.Line(".ct-chart", data, options);

            chart.on("draw", function(data) {

                if(data.type === "line"){

                    if (data.values[0] === 0 && data.values[1] === 0) {

                        // Get the first line or curve instruction (at position 0 is the move instruction)
                        var firstLine = data.path.pathElements[2];

                        // move cursor to position 0 and remove 2 elements (the move and first line instruction).
                        // then we can add a new move instruction based on the corrdinates of firstline
                        data.path
                            .position(0)
                            .remove(3)
                            .move(firstLine.x, firstLine.y);

                        // replace the current element path description attribute with the newly constructed one
                        data.element.attr({
                            d: data.path.stringify()
                        });
                    }
                }
            });
>>>>>>> master:charts/metro-on-time-performance/rail-performance/scripts/app.js

            var $chart = $('.ct-chart');

            var $tooltip = $('<div class="tooltip tooltip-hidden"></div>').appendTo($('.ct-chart'));
<<<<<<< HEAD:test/keller/in-development/metro-on-time-performance/rail-performance/scripts/app.js
             
            $(document).on('mouseenter', '.ct-point', function() {
              var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
                  value = $(this).attr('ct:value');
              
              $tooltip.text(seriesName + ': ' + value +'%');
=======

            $(document).on('mouseenter', '.ct-point', function() {
              var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
                  value = $(this).attr('ct:value');

              $tooltip.text(seriesName + ': ' + value +'% late');
>>>>>>> master:charts/metro-on-time-performance/rail-performance/scripts/app.js
              $tooltip.removeClass('tooltip-hidden');
            });

            $(document).on('mouseleave', '.ct-point', function() {
              $tooltip.addClass('tooltip-hidden');
            });

            $(document).on('mousemove', '.ct-point', function(event) {
<<<<<<< HEAD:test/keller/in-development/metro-on-time-performance/rail-performance/scripts/app.js
              console.log(event);
              $tooltip.css({
                left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
                top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
              });
=======
                $tooltip.css({
                    left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
                    top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
                });
>>>>>>> master:charts/metro-on-time-performance/rail-performance/scripts/app.js
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
            this.drawChart();
        }
    });