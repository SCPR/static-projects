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
    var dataSheet = 'LIVE_Jobs_Added_Per_Month_2012';

    // container arrays
    var allJobsData = [];
    var arraysOfJobsData = [];

    // chart options
    var chart;
    var chartCategories = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: showInfo,
            simpleSheet: false,
            debug: true
        });

        drawHighchart();

    });

    // function to add commas to string
    function addCommas(nStr){
    	nStr += '';
    	x = nStr.split('.');
    	x1 = x[0];
    	x2 = x.length > 1 ? '.' + x[1] : '';
    	var rgx = /(\d+)(\d{3})/;
    	while (rgx.test(x1)) {
    		x1 = x1.replace(rgx, '$1' + ',' + '$2');
    	}
    	return x1 + x2;
    };

    // display data from tabletop
    function showInfo(data, tabletop){

        // handlebars variables
        var source   = $('#cat-template').html();
        var template = Handlebars.compile(source);

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

            // render to handlebars templates
            var html = template(record);
            var commaAddedHtml = addCommas(html)
            jqueryNoConflict('#content').append(commaAddedHtml);

            // set variables and convert to integers if needed
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
            allJobsData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

            // push each array to an array
            arraysOfJobsData.push(allJobsData);

        });

            // objects for highcharts data series
            var initialMonthlyJobs = {
                name: 'Initial',
                color: '#A6611A',
                type: 'areaspline',
                data: arraysOfJobsData[0]
            };

            var revisedMonthlyJobs = {
                name: 'Revised',
                color: '#377EB8',
                type: 'areaspline',
                data: arraysOfJobsData[1]
            };

            var finalMonthlyJobs = {
                name: 'Final',
                color: '#018571',
                type: 'areaspline',
                data: arraysOfJobsData[2]
            };

            // add respective objects to highcharts series
            chart.addSeries(finalMonthlyJobs);
            chart.addSeries(revisedMonthlyJobs);
            chart.addSeries(initialMonthlyJobs);

    };

    // draw the chart
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                zoomType: 'xy'
            },

            title: {
                text: 'Jobs Added To The U.S. Economy (2012)'
            },

            subtitle: {
                text: 'Data Source: Bureau of Labor Statistics'
            },

            xAxis: [{
                categories: chartCategories
            }],

            yAxis: [{

                tickPixelInterval: 25,

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
                }
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