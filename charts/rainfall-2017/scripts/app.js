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
$.get('data/rainfall-2016-11-16.csv', function(csv) {
$('#container').highcharts({
                    chart: {
                        backgroundColor: null,
                        type: 'spline',
                        spacingTop: 29,
                        spacingRight: 15,
                        spacingLeft: 15
                    },
                    colors: ['#898989', '#B5BEC0', '#31ABD4'],
                    data: {
                        csv: csv,
                        dataLabels:{enabled:true}
                    },
                    title: {
                        text: ""
                    },
                    legend: {
                                itemStyle: {
                                    fontFamily: 'Arial',
                                    fontSize: 16
                                }
                            },
                    xAxis: {
                        labels: {
                            y: 28,
                            style: {
                                fontSize: 17,
                                fontFamily: 'Arial',
                                color: '#363636'
                            }},
                        type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%e.',
                                week: '%b %e ',
                                month: '%b',
                            },
                        },
                    yAxis: {
                        labels: {
                            style: {
                                fontSize: 15,
                                fontFamily: 'Arial',
                                color: '#363636'
                            }},
                        title: {
                            text: 'Percent of normal rainfall',
                            style: {
                                fontSize: 15,
                                color: '#363636'
                            }
                        },
                        endOnTick:false,
                        max: 87,
                        gridLineColor: '#B5BEC0'
                        },
                    tooltip: {
                        formatter: function() {
                            return this.series.name + ' at <b>' + this.y + '</b> percent of normal rainfall on '+
                    Highcharts.dateFormat('%b %e',
                                          new Date(this.x))
                ;
                        }
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                transparency: 0,
                                radius: 0

                            }
                        },
                        series: {
                            lineWidth: 5.5,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            },
/*                        dataLabels: {
                            enabled: true,
                            crop:false,
                            overflow:'none',
                            align: 'left',
                            y:10,
                            useHTML: true,
                            formatter: function() {
                                if (????) return '<span style="color:'
                                +this.series.color+'">'
                                +this.series.name+'</span>';
                            }
                        }*/
                        },
                    }

                });
            })},




        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            this.drawChart();
        }
    });
