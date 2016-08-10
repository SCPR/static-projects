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
        title: {
            text: 'Daily gun sales in California',
            style: {fontSize: '15pt'}
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
              value: Date.UTC(2016, 5, 12, 0, 0, 0) // Position, you'll have to translate this to the values on your x axis
                },
                {
              color: 'rgba(34,38,40,.45)',
              width: 2.5,
              value: Date.UTC(2016, 6, 7, 0, 0, 0) // Position, you'll have to translate this to the values on your x axis
                },{
              color: 'rgba(34,38,40,.45)',
              width: 2.5,
              value: Date.UTC(2016, 6, 1, 0, 0, 0) // Position, you'll have to translate this to the values on your x axis
                }

          ],
        },


        yAxis: {
            min: 0,
          max: 6000,
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
                pointInterval: 86400000, // one day
                pointStart: Date.UTC(2016, 4, 1, 0, 0, 0)
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
    xValue: Date.UTC(2016, 5, 11, 12, 0, 0),
    yValue: 725,
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
    xValue: Date.UTC(2016, 6, 7, 0, 0, 0),
    yValue: 725,
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
    xValue: Date.UTC(2016, 5, 30, 12, 0, 0),
    yValue: 725,
        title: {
        text: 'CA gun bills',
                rotation: 270,
                style:{
                    color: 'rgba(34,38,40,.9)'
            }
    }
  }
  ],
      credits: {
      enabled: false
    },

        series: [{
            name: 'Daily gun sales',
            data: [
1232,
2093,
2531,
2400,
2478,
3051,
3050,
864,
2130,
2445,
2407,
2307,
2708,
2819,
1186,
2092,
2508,
2395,
2437,
3334,
3463,
1385,
2291,
2666,
2559,
2516,
3090,
2835,
1061,
722,
2564,
2444,
2515,
2838,
2975,
1321,
2160,
2609,
2459,
2579,
3018,
3289,
1893,
3113,
3833,
3844,
4249,
4694,
4779,
1723,
2890,
3460,
3264,
3364,
3636,
3703,
1468,
2481,
2941,
2732,
3243,
5907,
5612,
2062,
771,
4103,
3595,
3888,
4931,
5051,
2059,
2972,
3556,
3660,
3615,
4625,
4396,
1942,
2934,
3571,
1959,
610],
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
