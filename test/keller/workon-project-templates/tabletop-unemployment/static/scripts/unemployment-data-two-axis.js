/* TO DO
 - Number for month; revison to previous months; quarterly basis average.
 - create option to filter... this will ultimately be based on the visual.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdHRxR2oyZXNDTnZOaWtMclZUdVM5amc';

    // the sheet being queried
    var dataSheet = 'Jobs Added Per Month-2012';

    var initialJobsData;
    var revisedJobsData;

    // chart options
    var chart;
    var chartType = 'column';

    var chartCategories = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];


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

    function showInfo(data, tabletop){

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

            // set variables and convert to integers if needed
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
            initialJobsData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

        });

            var chartData = {
                name: 'Jobs Added',
                color: '#4572A7',
                type: 'column',
                yAxis: 1,
                data: initialJobsData
            };

            var secondData = {
                name: 'Revised Estimates',
                color: '#89A54E',
                type: 'spline',
                data: [100000, 322000, 110000, 75000, 90000, 190000, 110000, 210000, 150000, 178000]
            };

            chart.addSeries(chartData);
            chart.addSeries(secondData);
    };

    //begin function
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'highcharts-ouput',
                zoomType: 'xy'
            },

            title: {
                text: 'Civilian Labor Force Level'
            },

            subtitle: {
                text: 'Source: Bureau of Labor Statistics'
            },

            xAxis: [{
                categories: chartCategories,

            }],

            yAxis: [{

                // primary axis
                labels: {
                    formatter: function() {
                        return this.value +' thousands';
                    },
                    style: {
                        color: '#89A54E'
                    }
                },
                title: {
                    text: 'Monthly Revisions',
                    style: {
                        color: '#89A54E'
                    }
                }
            }, {
                // secondary axis
                labels: {
                    formatter: function() {
                        return this.value +' thousands';
                    },
                    style: {
                        color: '#4572A7'
                    }
                },
                title: {
                    text: 'Jobs Added',
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: true
            }],

            tooltip: {
                formatter: function() {
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                }
            },

            plotOptions: {
                series: {
                    //stacking: 'normal',
                    pointWidth: 10
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

            series: []
        });

    };
    //end function