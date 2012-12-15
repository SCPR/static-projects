var jqueryNoConflict = jQuery;
var chart;
jqueryNoConflict(function () {
    jqueryNoConflict(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                type: 'column',
            },
            title: {
                text: 'Same Store Sales',
            },
            subtitle: {
                text: 'Same-store sales are from stores opened at least a year',
            },
            xAxis: {
                categories: ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'],

                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: 'Same Store Sales'
                }
            },
            tooltip: {
                formatter: function() {
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 2, '.') + '%';
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
                shadow: true
            },
            credits: {
                enabled: true,
                text: 'Source: JC Penney Co. Inc. and Morningstar'
            },
            series: [{
                name: '2007',
                data: [3.4, 2.9, -2.4, -2.3]
            }, {
                name: '2008',
                data: [-7.4, -4.3, -10.1, -10.8]
            }, {
                name: '2009',
                data: [-7.5, -9.5, -4.6, -4.5]
            }, {
                name: '2010',
                data: [1.3, 0.9, 1.9, 4.5]
            }, {
                name: '2011',
                data: [3.8, 1.5, -1.6, -1.8]
            }, {
                name: '2012',
                data: [-18.9, -21.7, -26.1]
            }]
        });
    });

});