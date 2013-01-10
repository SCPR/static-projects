var jqueryNoConflict = jQuery;
var chart;
var chartCategories = ['2011-12', '2012-13', '2013-14', '2014-15', '2015-16', '2016-17'];

// begin
jqueryNoConflict(function () {
    jqueryNoConflict(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                type: 'area',
                marginTop: 80,
                marginBottom: 50
            },
            title: {
                text: 'Education Funding from the state of California',
            },
            subtitle: {
                text: 'Spending, and proposed spending, between 2011 and 2017',
            },
            xAxis: [{
                categories: chartCategories
            }],

            yAxis: {
                title: {
                    text: 'Billions of Dollars'
                },
                min: 45,
                max: 70,
                tickPixelInterval: 30
            },
            tooltip: {
                formatter: function() {
                    return '<strong>' + this.x + ':</strong> ' +
                    Highcharts.numberFormat(this.y, 1, '.') + ' billion dollars';
                }
            },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: -130,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },

/*
           plotOptions: {
                area: {
                    pointStart: 2007,
                    pointInterval: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
*/

            credits: {
                enabled: true,
                text: 'Source: 2013-14 Governor\'s Budget Summary',
                href: 'http://www.ebudget.ca.gov/pdf/BudgetSummary/FullBudgetSummary.pdf',

                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    y: -5
                }
            },
            series: [{
                name: 'Education Funding',
                data: [47.3, 53.5, 56.2, 60.2, 63.5, 66.4]
            }]
        });
    });
});