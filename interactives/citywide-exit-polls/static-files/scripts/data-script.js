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
    var dataSpreadsheet = '0Aq8qwSArzKP9dGplcDloU0IzM1lNdkVyTkd3RnNsQmc';

    // the sheet being queried
    var dataSheet = 'mayoral_vote_by_race';

    // container arrays
    var allCityData = [];
    var arraysOfCityData = [];

    // chart options
    var chart;
    var chartCategories = ['Percentofvote', 'Latino', 'White', 'Black', 'Asian', 'Other'];

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
            var EricGarcetti = parseInt(record.EricGarcetti);
            var WendyGreuel = parseInt(record.WendyGreuel);
            var KevinJames = parseInt(record.KevinJames);
            var JanPerry = parseInt(record.JanPerry);
            var EmanuelPleitez = parseInt(record.EmanuelPleitez);
            var Other = parseInt(record.Other);

            // build array from each row of spreadsheet
            allCityData = [EricGarcetti, WendyGreuel, KevinJames, JanPerry, EmanuelPleitez, Other];

            // push each array to an array
            arraysOfCityobsData.push(allCityData);

        });

            // objects for highcharts data series
            var initialMonthlyJobs = {
                name: 'Initial',
                color: '#002734',
                type: 'column',
                data: arraysOfCityData[0]
            };


    };

    // draw the chart
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'data-chart',
                zoomType: 'xy'
            },

            title: {
                text: 'Mayoral Elections by Race'
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
                        return this.value +'%';
                    },
                    style: {
                        color: '#2B2B2B'
                    }
                },
                title: {
                    text: 'Candidate',
                    style: {
                        color: '#2B2B2B'
                    }
                },

                tickPixelInterval: 5

            }],

            tooltip: {
                formatter: function(){
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                }
            },

/*
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