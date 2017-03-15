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
                pointStart: Date.UTC(2016, 0, 1, 0, 0, 0)
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
    xValue: Date.UTC(2016, 5, 10, 0, 0, 0),
    yValue: 725,
        title: {
        text: 'Orlando',
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
                style:{
                    color: 'rgba(34,38,40,.9)'
            }
    }
  },{
    anchorX: 'right',
    anchorY: 'top',
    color: '#B123FF',
    xValue: Date.UTC(2016, 5, 29, 0, 0, 0),
    yValue: 5325,
        title: {
        text: 'CA gun<br>bills',
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
            data: [632,
3699,
1538,
3124,
4026,
3513,
3523,
4231,
4338,
1550,
2601,
2993,
2927,
3023,
3707,
4088,
1498,
2539,
2775,
2614,
2599,
3244,
3622,
1259,
2161,
2780,
2527,
2595,
3312,
3642,
1366,
2277,
2811,
2810,
2620,
3247,
3487,
955,
2150,
2634,
2988,
2871,
3499,
3598,
1448,
2503,
2773,
2563,
2810,
3267,
3590,
1580,
2298,
2849,
2862,
2881,
3329,
3418,
1411,
2260,
2804,
2747,
2805,
3280,
3790,
1502,
2520,
2846,
2730,
2728,
3248,
3712,
1502,
2295,
2774,
2679,
2606,
3144,
3253,
1486,
2295,
2795,
2598,
2471,
3301,
3039,
245,
2316,
2616,
2540,
2634,
2820,
3174,
1378,
2127,
2638,
2395,
2409,
2873,
3357,
1238,
2047,
2443,
2435,
2586,
3074,
2980,
1194,
1936,
2516,
2408,
2512,
2933,
3052,
1285,
2157,
2575,
2359,
2662,
3272,
3277,
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
