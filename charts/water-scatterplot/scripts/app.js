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
            $('#container').highcharts({
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                    backgroundColor: '#EAEAEA',
                    style: {
                        fontFamily: "arial"
                    }
                },
                title: {
                    text: ""
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    followPointer: true
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: 'Median Household Income',
                            style: {
                                fontSize: '18px'
                            }
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true
                },
                yAxis: {
                    title: {
                        text: 'Gallons of water per resident per day',
                            style: {
                                fontSize: '18px'
                            }
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            symbol: 'circle',
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)',

                                }

                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '${point.x}, {point.y} gallons/day'
                        }
                    }
                },
                series: [
                {
                    name: 'Arcadia',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [77704, 115.1]
                    ]
                }, {
                    name: 'Chino Hills',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [96497, 105.9]
                    ]
                }, {
                    name: 'Los Angeles',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [49497, 73.9]
                    ]
                }, {
                    name: 'Upland',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [62667, 142.2]
                    ]
                }, {
                    name: 'Ontario',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [54249, 87]
                    ]
                }, {
                    name: 'Santa Fe Springs',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [54081, 72.5]
                    ]
                }, {
                    name: 'Anaheim',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [59165, 80.3]
                    ]
                }, {
                    name: 'Orange',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [78838, 121]
                    ]
                }, {
                    name: 'Buena Park',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [66371, 79.7]
                    ]
                }, {
                    name: 'Glendale',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [53020, 87.2]
                    ]
                }, {
                    name: 'Riverside',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [55636, 96]
                    ]
                }, {
                    name: 'Manhattan Beach',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [139259, 92.1]
                    ]
                }, {
                    name: 'Garden Grove',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [59648, 108.1]
                    ]
                }, {
                    name: 'Long Beach',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [52711, 73.9]
                    ]
                }, {
                    name: 'Downey',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [60939, 87.5]
                    ]
                }, {
                    name: 'Pomona',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [49474, 59.9]
                    ]
                }, {
                    name: 'Cerritos',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [89594, 111.5]
                    ]
                }, {
                    name: 'Oceanside',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [58153, 81.8]
                    ]
                }, {
                    name: 'Florence-Graham',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [35543, 51.9]
                    ]
                }, {
                    name: 'Burbank',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [66240, 91.7]
                    ]
                }, {
                    name: 'Monterey Park',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [56014, 87.5]
                    ]
                }, {
                    name: 'Costa Mesa',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [65830, 88.4]
                    ]
                }, {
                    name: 'Santa Ana',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [53335, 62.6]
                    ]
                }, {
                    name: 'Beverly Hills',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [86141, 167.6]
                    ]
                }, {
                    name: 'Paramount',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [44934, 50.8]
                    ]
                }, {
                    name: 'Culver City',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [77333, 68.9]
                    ]
                }, {
                    name: 'Fullerton',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [67384, 105]
                    ]
                }, {
                    name: 'Brea',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [79124, 78.9]
                    ]
                }, {
                    name: 'Lynwood',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [40740, 70]
                    ]
                }, {
                    name: 'La Verne',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [77040, 104.2]
                    ]
                }, {
                    name: 'La Palma',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [85759, 59.5]
                    ]
                }, {
                    name: 'Pasadena',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [69302, 93.8]
                    ]
                }, {
                    name: 'La Habra',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [61702, 74]
                    ]
                }, {
                    name: 'Sierra Madre',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [88837, 152.6]
                    ]
                }, {
                    name: 'South Pasadena',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [85058, 92.2]
                    ]
                }, {
                    name: 'Alhambra',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [54148, 90.3]
                    ]
                }, {
                    name: 'Seal Beach',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [51242, 52.4]
                    ]
                }, {
                    name: 'Villa Park',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [155525, 333.3]
                    ]
                }, {
                    name: 'Fountain Valley',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [80870, 54.1]
                    ]
                }, {
                    name: 'San Juan Capistrano',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [75600, 109.6]
                    ]
                }, {
                    name: 'Westminster',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [52633, 78.5]
                    ]
                }, {
                    name: 'Loma Linda',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [54720, 133.8]
                    ]
                }, {
                    name: 'Santa Monica',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [73649, 82.1]
                    ]
                }, {
                    name: 'Monrovia',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [71768, 115.3]
                    ]
                }, {
                    name: 'San Fernando',
                    marker: {
                        symbol: 'circle'
                    },
                    color: 'rgba(119, 152, 191, .5)',
                    data: [
                        [55192, 86.3]
                    ]
                }

                ]
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            this.drawChart();
        }
    });