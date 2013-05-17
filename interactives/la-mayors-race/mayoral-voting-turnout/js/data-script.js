    var jqueryNoConflict = jQuery;
    var configFn = configFn || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        configFn.retriveData();
    });

    // master data configuration object
    var configFn = {
        retriveData: function() {
            var dataSource = 'data/turnout-data.json';
            jqueryNoConflict.getJSON(dataSource, configFn.formatDataForChart);
        },

        chartPrototypeArray: [],
        chartPrototypeObject: {},

        formatDataForChart: function(data){

           var arrayOfElections = [];
           var arrayOfTurnout = [];
           var arrayOfDates = [];

            // loop through...
            for(var i=0; i<data.objects.length; i++){
                var winner_total = data.objects[i]['Winner\'s vote total'];
                var ballots_cast = data.objects[i]['Ballots cast'];
                var registered_voters = data.objects[i]['Registered voters'];
                var turnout = data.objects[i]['Turnout'];
                configFn.chartPrototypeObject['winner_total'] = parseInt(winner_total);
                configFn.chartPrototypeObject['ballots_cast'] = parseInt(ballots_cast);
                configFn.chartPrototypeObject['registered_voters'] = parseInt(registered_voters);
                configFn.chartPrototypeObject['turnout'] = parseFloat(turnout);
                configFn.chartPrototypeObject['date'] = data.objects[i]['Date'];
                arrayOfTurnout.push(parseFloat(turnout));
                arrayOfDates.push(data.objects[i]['Date']);
                arrayOfElections.push(configFn.chartPrototypeObject);
            }

            configFn.writeBlueprintChartSeries('data-chart', 'L.A. mayoral election turnout since 1913', 'Source: L.A. Times Data Desk', arrayOfDates, arrayOfTurnout);
        },

        // the blueprint for a chart data
        writeBlueprintChartSeries: function(containerToRenderTo, titleText, subtitleText, chartCategories, chartDataArray){
            var chartSeries = {
                name: 'Does thsi dhow up',
                color: '#002734',
                type: 'bar',
                data: chartDataArray
            };

            var dataSeriesContainer = [chartSeries];

            var charts = [new Highcharts.Chart(
                getSplineChartConfig(containerToRenderTo, titleText, subtitleText, chartCategories, dataSeriesContainer)
            )];

        },

    }
    // end main config function

    // create an instance of the chart
    function getSplineChartConfig(containerToRenderTo, titleText, subtitleText, chartCategories, chartDataArray){

        var configChart = {};

        configChart.chart = {
            renderTo: containerToRenderTo,
            backgroundColor: '#ffffff',
            zoomType: 'xy',
        };

        configChart.title = {
            text: titleText
        };

        configChart.subtitle = {
            //text: subtitleText
        };

        configChart.xAxis = [{
            categories: chartCategories,
        }];

        configChart.yAxis = [{

            // primary axis
            labels: {
               formatter: function() {
                    return this.percentage;
                },
                style: {
                    color: '#2B2B2B'
                }
            },
            title: {
                text: 'Percent of voter turnout',
                style: {
                    color: '#2B2B2B'
                }
            },

        }];

        configChart.plotOptions = {
            bar: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return Highcharts.numberFormat(this.y, 2, '.') + '%';
                    },
                },
            }
        };

        configChart.tooltip = {
            enabled: false,
            formatter: function(){
                return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 2, '.') + '%';
            }
        };

        configChart.legend = {
            enabled: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            y: 0,
            floating: false,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        };

        configChart.credits = {
            enabled: false,
            text: 'KPCC'
        };

        configChart.series = chartDataArray;

        return configChart;

    };
    //end function