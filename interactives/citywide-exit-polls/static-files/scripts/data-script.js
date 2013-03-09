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

            var candidate = record.candidate;
            var asian = parseInt(record.asian);
            var black = parseInt(record.black)
            var latino = parseInt(record.latino)
            var other = parseInt(record.other)
            var percentofvote = parseInt(record.percentofvote)
            var rowNumber = record.rowNumber
            var white = parseInt(record.white)

            // logs data type of variable
           // console.log(typeof(asian));
           
            // build array from each row of spreadsheet
            allCityData = [candidate, asian, black, latino, other, white, percentofvote];

            // logs array of data each time through the loop
            console.log(allCityData);

            // push each array to an array
            arraysOfCityData.push(allCityData);

        });

        // shows array of arrays after loop
        console.log(arraysOfCityData);


        var finalMonthlyJobs = {
            name: 'Final',
            color: '#005873',
            type: 'pie',
            data: arraysOfCityData[2]
        };

        // add respective objects to highcharts series
        //chart.addSeries(initialMonthlyJobs);

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
                text: 'Data Source: Loyala Marymount University'
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