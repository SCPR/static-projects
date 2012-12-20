var jqueryNoConflict = jQuery;
var chart;

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
                text: 'Sales of firearms in California',
            },
            subtitle: {
                text: 'Licensed dealer transactions processed by <br /> state Dept. of Justice between 1991 and 2011',
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Transactions'
                },
                max: 650000,
                tickPixelInterval: 20
            },
            tooltip: {
                formatter: function() {
                    return '<strong>' + this.x + ':</strong> ' + Highcharts.numberFormat(this.y, 0, '.');
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
           plotOptions: {
                area: {
                    pointStart: 1991,
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
            credits: {
                enabled: true,
                text: 'Source: California Office of the Attorney General',
                href: 'http://oag.ca.gov/sites/all/files/pdfs/firearms/forms/dros_chart.pdf?',

                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    y: -5
                }
            },
            series: [{
                name: 'Licensed Dealer Sales',
                data: [489433, 559608, 642197, 599672,
                411668, 353872, 355136, 342540, 513418,
                386210, 353722, 352425, 290376, 315065,
                344847, 375573, 370628, 425244, 483872,
                498945, 601243]
            }]
        });
    });
});