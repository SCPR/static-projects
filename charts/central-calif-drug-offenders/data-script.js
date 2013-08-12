    var jqueryNoConflict = jQuery;

    // write chart on page load
    jqueryNoConflict(document).ready(function(){
        createPieChart('data-chart', pieDataSeries);
        createStackChart('stack-chart', stackDataSeries);
    });

    var pieDataSeries = [
        ['Immigration', 29.2],
        ['Drugs', 26.4],
        ['Fraud', 17.0],
        ['Other', 12.8],
        ['Non-Fraud<br />White Collar', 5.0],
        ['Firearms', 4.9],
        ['Child Pornography', 3.1],
        ['Larceny', 1.6],
    ]

    var stackDataSeries = [{
        name: 'Other',
        data: [
            8.5
        ]
    }, {
        name: 'Heroin',
        data: [
            8.1
        ]
    }, {
        name: 'Marijuana',
        data: [
            10.6
        ]
    }, {
        name: 'Crack Cocaine',
        data: [
            13.6
        ]
    }, {
        name: 'Powder Cocaine',
        data: [
            15.7
        ]
    }, {
        name: 'Methamphetamine',
        data: [
            43.6
        ]
    }]

    function createPieChart(renderToContainer, dataSeries) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: renderToContainer,
                type: 'pie',
            },

            title: {
                text: 'Central California offenders per primary offense',
            },

            subtitle: {
                text: 'Source: U.S. Sentencing Commission\'s 2012 Statistical Information packet',
            },

            xAxis: {
                categories: [
                    'July 2012',
                    'July 2013',
                ],

                title: {
                    text: null
                }
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            tooltip: {
                formatter: function() {
                    return Highcharts.numberFormat(this.y, 2, '.') + '%';
                }
            },

            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 10,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true,
                reversed: true,
                margin: 30
            },

            credits: {
                enabled: false,
                text: 'Source: U.S. Sentencing Commission\'s 2012 Statistical Information packet'
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },

            series: [{
                type: 'pie',
                name: 'Percent: ',
                data: dataSeries
            }]

        });
    }

    function createStackChart(renderToContainer, dataSeries) {
        var chart = new Highcharts.Chart({

            chart: {
                renderTo: renderToContainer,
                type: 'bar',
            },

            title: {
                text: 'Drug offenses broken down by drug',
            },

            subtitle: {
                text: null,
            },

            xAxis: {
                categories: [
                    '2012',
                ],

                title: {
                    text: null
                },

            },

            yAxis: {
                title: {
                    text: null
                },

                max: 100,
                tickInterval: 10,

            },
            tooltip: {
                formatter: function() {
                    return this.series.name + ': ' + Highcharts.numberFormat(this.y, 2, '.') + '%';
                }
            },

            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 10,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true,
                reversed: true,
                margin: 30
            },

            credits: {
                enabled: false,
                text: 'Source: Los Angeles, Orange, Riverside and San Bernardino county clerks'
            },

            plotOptions: {

                series: {
                    stacking: 'normal',
                }
            },

            series: dataSeries
        });
    }