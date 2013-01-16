var jqueryNoConflict = jQuery;
var chart;

// begin
jqueryNoConflict(function () {
    jqueryNoConflict(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                zoomType: 'xy',
                backgroundColor: '#fff',
                type: 'area',
                marginTop: 50
            },

            title: {
                text: 'Firearm transactions processed by the<br />California Department of Justice (1991-2011)'
            },
            subtitle: {
                text: '',
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },

            yAxis: [{

                // primary axis
                labels: {
                   formatter: function() {
                        return this.value / 1000 +'k';
                    },
                    style: {
                        color: '#2B2B2B'
                    }
                },
                title: {
                    text: 'Dealer Transactions',
                    style: {
                        color: '#2B2B2B'
                    }
                },
                max: 650000,
                tickPixelInterval: 100

            }],

            tooltip: {
                formatter: function() {
                    return '<strong>' + this.x + ':</strong> ' + Highcharts.numberFormat(this.y, 0, '.');
                }
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

            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                //x: -130,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },


            credits: {
                enabled: true,
                text: 'Source: California Dept. of Justice Bureau of Firearms',
                href: 'http://oag.ca.gov/sites/all/files/pdfs/firearms/forms/dros_chart.pdf?',

                position: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    y: -5
                }
            },
            series: [{
                name: 'Dealer Transactions',
                color: '#002734',
                type: 'area',
                data: [489433, 559608, 642197, 599672,
                411668, 353872, 355136, 342540, 513418,
                386210, 353722, 352425, 290376, 315065,
                344847, 375573, 370628, 425244, 483872,
                498945, 601243]
            }]
        });
    });
});