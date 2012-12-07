/* TO DO
 - Number for month; revison to previous months; quarterly basis average.
 - Fill in x axis labels from spreadsheet
 - Fill in year information from spreadsheet.
 - create option to filter... this will ultimately be based on the visual.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdHRxR2oyZXNDTnZOaWtMclZUdVM5amc';

    // the sheet being queried
    var dataSheet = 'Civilian Labor Force Level';
    var queriedData = [];
    var chartData = [];

    // chart options
    var chart;
    var chartType = 'column';
    var minChart = 0;
    var maxChart = 175000;

    // begin main function
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: showInfo,
            simpleSheet: false,
            debug: true
        });

        drawHighchart();

    });

    function showInfo(data, tabletop) {

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

            var year = record.year;
            var jan = parseInt(record.jan);
            var feb = parseInt(record.feb);
            var mar = parseInt(record.mar);
            var apr = parseInt(record.apr);
            var may = parseInt(record.may);
            var jun = parseInt(record.jun);
            var jul = parseInt(record.jul);
            var aug = parseInt(record.aug);
            var sep = parseInt(record.sep);
            var oct = parseInt(record.oct);
            var nov = parseInt(record.nov);
            var dec = parseInt(record.dec);
            var annual = parseInt(record.annual);

            // build array from each row of spreadsheet
            queriedData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

            // push each array into another
            chartData.push(queriedData);

            // set each array to the chart data series
            chart.series[i].setData(chartData[i], chartType)

        });
    };


    //begin function
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'highcharts-ouput',
                type: chartType
            },

            title: {
                text: 'Civilian Labor Force Level'
            },

            subtitle: {
                text: 'Source: Bureau of Labor Statistics'
            },

            xAxis: {
                categories: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],

                title: {
                    text: null
                }
            },

            yAxis: {
    			min: minChart,
    			max: maxChart,
                title: {
                    text: 'Number of Unemployment Claims',
                    align: 'high'
                },

                labels: {
                    overflow: 'justify'
                }
            },

            tooltip: {
                formatter: function() {
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                }
            },

            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                //x: 0,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },

            credits: {
                enabled: false
            },

            series: [{
                name: '2002',
                data: []
            }, {
                name: '2003',
                data: []
            }, {
                name: '2004',
                data: []
            }, {
                name: '2005',
                data: []
            }, {
                name: '2006',
                data: []
            }, {
                name: '2007',
                data: []
            }, {
                name: '2008',
                data: []
            }, {
                name: '2009',
                data: []
            }, {
                name: '2010',
                data: []
            }, {
                name: '2011',
                data: []
            }, {
                name: '2012',
                data: []
            }]
        });

    };
    //end function