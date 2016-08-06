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

        drawChart: function () {

$(function() {
    Highcharts.setOptions({
        lang: {
            thousandsSep: ',',
            numericSymbols: null
        },
        chart: {
        style: {
            fontFamily: 'helvetica',
            fontSize: 14,
        }
    }

    });

$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline',
      backgroundColor: null,

        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify',
                style: {
                        fontSize: 15,
                }
            },
            plotLines: [{
              color: 'rgba(34,38,40,.45)',
              width: 2.5,
              value: Date.UTC(2016, 5, 6, 0, 0, 0) // True date is June 12 but occured week beginning June 6
                },
                {
              color: 'rgba(34,38,40,.45)',
              width: 2.5,
              value: Date.UTC(2016, 6, 4, 0, 0, 0) // True date is July 7 but occured week of july 4
                },{
              color: 'rgba(34,38,40,.45)',
              width: 2.5,
              value: Date.UTC(2016, 5, 27, 0, 0, 0) // True date is July 1 but occured week beinning June 27
                }

          ],
        },


        yAxis: {
            min: 15000,
//          max: 6000,
          title: {
            enabled: false,
//            text: 'Custom with <b>simple</b> <i>markup</i>',
        },
            labels: {
                style: {
                        fontSize: 15,
                }
            },

        },

        tooltip: {
            valueSuffix: ' guns',
            style: {fontSize: '10pt'}

        },
        title:{
    text: null
        },
        plotOptions: {
            spline: {
                lineWidth: 2.5,
                states: {
                    hover: {
                        lineWidth: 3,
                        halo: {
              size: 0
            }

                    }
                },
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    transparency: 0,
                    radius: 0,

                },
                pointInterval: 604800000, // seven days
                pointStart: Date.UTC(2016, 0, 4, 0, 0, 0) // first day of our first (full) week is january 4
            }
        },
    exporting: {
         enabled: false
},

        annotationsOptions: {
            enabledButtons: false
        },
  annotations: [{
    anchorX: 'right',
    anchorY: 'top',
    color: '#B123FF',
    xValue: Date.UTC(2016, 5, 4, 15, 0, 0),
    yValue: 22725,
        title: {
        text: 'Orlando',
                rotation: 270,
                style:{
                    color: 'rgba(34,38,40,.9)'
            }
    }
  },
  {
    anchorX: 'left',
    anchorY: 'top',
    color: '#B123FF',
    xValue: Date.UTC(2016, 6, 4, 7, 0, 0),
    yValue: 17725,
        title: {
        text: 'Dallas',
                rotation: 270,
                style:{
                    color: 'rgba(34,38,40,.9)'
            }
    }
  },{
    anchorX: 'right',
    anchorY: 'top',
    color: '#B123FF',
    xValue: Date.UTC(2016, 5, 25, 12, 0, 0),
    yValue: 18025,
        title: {
        text: 'CA gun bills',
                rotation: 270,
                style:{
                    color: 'rgba(34,38,40,.9)',
            }
    }
  }
  ],
      credits: {
      enabled: false
    },

        series: [{
            name: 'Sales',
            data: [24305,
20837,
18652,
18383,
18207,
19188,
19086,
19048,
19188,
19286,
18237,
16744,
17478,
17037,
16759,
16642,
17534,
16467,
16002,
17614,
17018,
15379,
18007,
26235,
21785,
24978,
24398,
24766],
color: 'rgba(209,89,4,.8)'

        },
        //{
            //name: 'Vik',
            //data: [0, 0, 0.6, 0.9, 0.8, 0.2, 0, 0, 0, 0.1, 0.6, 0.7, 0.8, 0.6, 0.2, 0, 0.1, 0.3, 0.3, 0, 0.1, 0, 0, 0, 0.2, 0.1, 0, 0.3, 0, 0.1, 0.2, 0.1, 0.3, 0.3, 0, 3.1, 3.1, 2.5, 1.5, 1.9, 2.1, 1, 2.3, 1.9, 1.2, 0.7, 1.3, 0.4, 0.3]
        //}
        ],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });



});
});


        },




        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            this.drawChart();
        }
    });
