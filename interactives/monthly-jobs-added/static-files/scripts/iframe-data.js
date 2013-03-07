/*
    docs on highcharts click events
    http://api.highcharts.com/highcharts#plotOptions.line.events.legendItemClick

TO DO
* The narrative could use some work, as could clear instructions to the user... For instance, click on the chart legend to filter the chart and the table, mouse over, etc.
* I'd like to do more to integrate the chart and the table... rather than highlight the entire row, the specific number perhaps.
* Start over with a new 2013 chart? Seems like it should track the past year or so.
* Clearer instructions, particularly for using the legend are needed.
* Slide toggle through the dates would be cool.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdFZ4VTJIWngtY0VJWHJKM0dRUEpndVE';

    // the sheet being queried
    var dataSheet = 'MATTS_Jobs_Added_Per_Month_2012';

    // container arrays
    var allJobsData = [];
    var arraysOfJobsData = [];

    // chart options
    var chart;
    var chartCategories = ['J \'12', 'F \'12', 'M \'12', 'A \'12', 'M \'12', 'J \'12', 'J \'12', 'A \'12', 'S \'12', 'O \'12', 'N \'12', 'D \'12', 'J \'13', 'F \'13'];

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: showInfo,
            simpleSheet: false,
            debug: false
        });

        drawHighchart();

    });

    // display data from tabletop
    function showInfo(data, tabletop){

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

            // set variables and convert to integers if needed
            var jan2012 = parseInt(record.jan2012);
            var feb2012 = parseInt(record.feb2012);
            var mar2012 = parseInt(record.mar2012);
            var apr2012 = parseInt(record.apr2012);
            var may2012 = parseInt(record.may2012);
            var jun2012 = parseInt(record.jun2012);
            var jul2012 = parseInt(record.jul2012);
            var aug2012 = parseInt(record.aug2012);
            var sep2012 = parseInt(record.sep2012);
            var oct2012 = parseInt(record.oct2012);
            var nov2012 = parseInt(record.nov2012);
            var dec2012 = parseInt(record.dec2012);
            var jan2013 = parseInt(record.jan2013);
            var feb2013 = parseInt(record.feb2013);

            // build array from each row of spreadsheet
            allJobsData = [jan2012, feb2012, mar2012, apr2012, may2012, jun2012, jul2012, aug2012, sep2012, oct2012, nov2012, dec2012, jan2013, feb2013];

            // push each array to an array
            arraysOfJobsData.push(allJobsData);

        });

            // objects for highcharts data series
            var initialMonthlyJobs = {
                name: 'Initial',
                color: '#002734',
                type: 'column',
                data: arraysOfJobsData[0]
            };

/*
            var revisedMonthlyJobs = {
                name: 'Revised',
                color: '#377EB8',
                type: 'areaspline',
                data: arraysOfJobsData[1]
            };
*/

            var finalMonthlyJobs = {
                name: 'Final',
                color: '#005873',
                type: 'areaspline',
                data: arraysOfJobsData[2]
            };

            // add respective objects to highcharts series
            //chart.addSeries(revisedMonthlyJobs);
            chart.addSeries(initialMonthlyJobs);
            chart.addSeries(finalMonthlyJobs);

    };

    // draw the chart
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                zoomType: 'xy'
            },

            title: {
                text: 'Jobs Added To U.S. Economy'
            },

            subtitle: {
                text: 'Data Source: Bureau of Labor Statistics'
            },

            xAxis: [{
                categories: chartCategories
            }],

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
                    text: 'Jobs Added',
                    style: {
                        color: '#2B2B2B'
                    }
                },

                tickPixelInterval: 25

            }],

            tooltip: {
                formatter: function(){
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                }
            },

            // testing various click event options
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: function() {
                                var highlightRowColor = String(this.series.color);
                                var highlightRowId = String(this.series.name);
                                var highlightCellId = String(this.x);
                                var selectedRow = 'tr#' + highlightRowId;
                                var selectedCell = 'td#' + highlightCellId;

                                jqueryNoConflict(selectedRow).css(
                                    {'text-decoration': 'underline', 'color': highlightRowColor});

                            },

                            mouseOut: function() {
                                var highlightRowColor = String(this.series.color);
                                var highlightRowId = String(this.series.name);
                                var highlightCellId = String(this.x);
                                var selectedRow = 'tr#' + highlightRowId;
                                var selectedCell = 'td#' + highlightCellId;

                                jqueryNoConflict(selectedRow).css(
                                    {'text-decoration': 'none', 'color': 'black'});
                            }
                        }
                    },

                    events: {

/*
                        mouseOver: function() {
                            var highlightRowId = String(this.name);
                            var highlightRowColor = String(this.color);
                            var selectedRow = 'tr#' + highlightRowId;
                            jqueryNoConflict(selectedRow).css(
                                    'color', highlightRowColor);
                        },

                        mouseOut: function() {
                            var highlightRowId = String(this.name);
                            var highlightRowColor = String(this.color);
                            var selectedRow = 'tr#' + highlightRowId;
                            jqueryNoConflict(selectedRow).css(
                                    'color', 'black');
                        },
*/

                        legendItemClick: function () {
                            var highlightRowId = String(this.name);
                            var selectedRow = 'tr#' + highlightRowId;
                            jqueryNoConflict(selectedRow).toggle();

                             //returning false cancels default action
                            // return false;
                        }
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

            series: []
        });

    };
    //end function