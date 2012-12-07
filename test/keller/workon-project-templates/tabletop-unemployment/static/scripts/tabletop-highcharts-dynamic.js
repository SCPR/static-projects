/* TO DO
 - Number for month; revison to previous months; quarterly basis average.
 - Fill in x axis labels from spreadsheet
 - create option to filter... this will ultimately be based on the visual.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdHRxR2oyZXNDTnZOaWtMclZUdVM5amc';

    // the sheet being queried
    var dataSheet = 'Civilian Labor Force Level';

    // chart options
    var chart;
    var chartType = 'column';
    var minChart = 0;
    var maxChart = 175000;
    //var columnHeaders = [];

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

/*
        // pulls column names
        jqueryNoConflict.each( tabletop.sheets(), function(i, sheet) {

            var headlineOne = sheet.column_names[1];
            var headlineTwo = sheet.column_names[2];
            var headlineThree = sheet.column_names[3];
            var headlineFour = sheet.column_names[4];
            var headlineFive = sheet.column_names[5];
            var headlineSix = sheet.column_names[6];
            var headlineSeven = sheet.column_names[7];
            var headlineEight = sheet.column_names[8];
            var headlineNine = sheet.column_names[9];
            var headlineTen = sheet.column_names[10];
            var headlineEleven = sheet.column_names[11];
            var headlineTwelve = sheet.column_names[12];

            columnHeaders = [headlineOne, headlineTwo, headlineThree, headlineFour, headlineFive, headlineSix, headlineSeven, headlineEight, headlineNine, headlineTen, headlineEleven, headlineTwelve];

        });
*/

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
            var queriedData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

            // build object to hold chart info and data array
            var chartData = {
                name: year,
                data: queriedData,
            };

            // add object to the chart series
            chart.addSeries(chartData, chartType)

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

            series: []
        });

    };
    //end function