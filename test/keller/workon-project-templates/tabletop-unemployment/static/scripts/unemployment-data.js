/* TO DO
 - Number for month; revison to previous months; quarterly basis average.
 - create option to filter... this will ultimately be based on the visual.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdHRxR2oyZXNDTnZOaWtMclZUdVM5amc';

    // the sheet being queried
    var dataSheet = 'Jobs Added Per Month-2012';

    // chart options
    var chart;
    var chartType = 'bar';

    var chartCategories = ['Dec.', 'Nov.', 'Oct', 'Sept.', 'Aug.', 'July', 'June', 'May', 'April', 'March', 'Feb.', 'Jan.'];


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

            xAxis: [{
                categories: chartCategories,
                reversed: false
            }, {
                opposite: true,
                reversed: false,
                categories: chartCategories,
                linkedTo: 0
            }],

            yAxis: {
                title: {
                    text: 'Number of Jobs Added Per Month',
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