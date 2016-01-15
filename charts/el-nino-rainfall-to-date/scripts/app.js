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
$.get('nino_to_date.csv', function(csv) {
$('#container').highcharts({
                    chart: {
/*                        marginRight: 150,    */
                        type: 'spline',
                        spacingTop: 29
                    },
                    colors: ['#31ABD4', '#898989', '#F87E21'],
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
                            style: {
                                fontSize: 15,
                                fontFamily: 'Arial'
                            }},
                        type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                            month: '%b',
                            //year: '%b'
                            },
                        },
                    yAxis: {
                        labels: {
                            style: {
                                fontSize: 15,
                                fontFamily: 'Arial'
                            }},
                        title: {
                            text: 'Percent of normal rainfall',
                            style: {
                                fontSize: 15
                            }
                        },
                        endOnTick:false,
                        max: 155
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
                            lineWidth: 3.8,
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
