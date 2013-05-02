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
    var dataSpreadsheet = '0AjsyCVrBXivzdFBOeDBOMnRJMmpzc3pHLXhhQnVRQVE';

    // the sheet being queried
    var dataSheet = 'LACERS_contribs';

    // container arrays
    var allContribsData = [];
    var arraysOfJobsData = [];

    // chart options
    var chart;
    var chartCategories = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];

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
            var 2002 = parseInt(record.2002);
            var 2003 = parseInt(record.2003);
            var 2004 = parseInt(record.2004);
            var 2005 = parseInt(record.2005);
            var 2006 = parseInt(record.2006);
            var 2007 = parseInt(record.2007);
            var 2008 = parseInt(record.2008);
            var 2009 = parseInt(record.2009);
            var 2010 = parseInt(record.2010);
            var 2011 = parseInt(record.2011);
            var 2012 = parseInt(record.2012);

            // build array from each row of spreadsheet
            allContribsData = [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];

            // push each array to an array
            arraysOfJobsData.push(allContribsData);

        });

            // objects for highcharts data series
           // var initialMonthlyJobs = {
                var PensionType = {
                name: 'Initial',
                color: '#002734',
                type: 'column',
                data: arraysOfContribsData[0]
            };

/*
            var revisedMonthlyJobs = {
                name: 'Revised',
                color: '#377EB8',
                type: 'areaspline',
                data: arraysOfJobsData[1]
            };
*/

           /* var finalMonthlyJobs = {
                name: 'Final',
                color: '#005873',
                type: 'areaspline',
                data: arraysOfJobsData[2]
            };

            var differenceMonthlyJobs = {
                name: 'Monthly Difference',
                data: arraysOfJobsData[3]
            };
*/

            renderHandlebarsTemplate('static-files/templates/data-table.handlebars', '#data-table', differenceMonthlyJobs);

            // add respective objects to highcharts series
            //chart.addSeries(revisedMonthlyJobs);
            chart.addSeries(PensionType);
            //chart.addSeries(finalMonthlyJobs);

    };

    // draw the chart
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                zoomType: 'xy'
            },

            title: {
                text: 'Pension contributions '
            },

            subtitle: {
                text: 'Data Sources: xxx'
            },

            xAxis: [{
                categories: chartCategories
            }],

            yAxis: [{

                // primary axis
                labels: {
                   formatter: function() {
                        return this.value / 1000000 +'M';
                    },
                    style: {
                        color: '#2B2B2B'
                    }
                },
                title: {
                    text: 'Years',
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