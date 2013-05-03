    var jqueryNoConflict = jQuery;
    var configData = configData || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        configData.initializeDataSource();

        jqueryNoConflict('a.chart-trigger').click(function (){
            configData.updateChart(this.id);
        });

    });

    // data configuration object
    var configData = {
        initializeDataSource: function(){
            Tabletop.init({
                key: '0AjsyCVrBXivzdFBOeDBOMnRJMmpzc3pHLXhhQnVRQVE',
                callback: configData.showInfo,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        deleteKeyFromObject: function(arrayToClean){
            var cleanedContribsData = [];
            for (var i=0;i<3;i++){
                delete arrayToClean[i].pensioncontributions;
                delete arrayToClean[i].rowNumber;
                cleanedContribsData.push(arrayToClean[i]);
            }
            return cleanedContribsData;
        },

        objectChartData: {},

        showInfo: function(data, tabletop){
            var dwpClean = configData.deleteKeyFromObject(data.dwp_contribs.elements);
            var lacersClean = configData.deleteKeyFromObject(data.lacers_contribs.elements);
            var laffpClean = configData.deleteKeyFromObject(data.laffp_contribs.elements);
            configData.objectChartData['dwp_chart'] = dwpClean;
            configData.objectChartData['lacers_chart'] = lacersClean;
            configData.objectChartData['laffp_chart'] = laffpClean;
            configData.writeDefaultChart();
        },

        writeDefaultChart: function(){
            configData.blueprintChartSeries(
                'data-chart',
                'Contributions to DWP',
                'Source:',
                configData.convertObjectToArray(configData.objectChartData.dwp_chart[0]),
                configData.convertObjectToArray(configData.objectChartData.dwp_chart[1]),
                configData.convertObjectToArray(configData.objectChartData.dwp_chart[2])
            );

        },

        updateChart: function(new_chart){
            console.log(new_chart);

            if (new_chart === 'dwp_chart'){
                configData.blueprintChartSeries(
                    'data-chart',
                    'Contributions to DWP',
                    'Source:',
                    configData.convertObjectToArray(configData.objectChartData.dwp_chart[0]),
                    configData.convertObjectToArray(configData.objectChartData.dwp_chart[1]),
                    configData.convertObjectToArray(configData.objectChartData.dwp_chart[2])
                );

            } else if (new_chart === 'lacers_chart'){
                configData.blueprintChartSeries(
                    'data-chart',
                    'Contributions to LACERS',
                    'Source:',
                    configData.convertObjectToArray(configData.objectChartData.lacers_chart[0]),
                    configData.convertObjectToArray(configData.objectChartData.lacers_chart[1]),
                    configData.convertObjectToArray(configData.objectChartData.lacers_chart[2])
                );

            } else {
                configData.blueprintChartSeries(
                    'data-chart',
                    'Contributions to LAFFP',
                    'Source:',
                    configData.convertObjectToArray(configData.objectChartData.laffp_chart[0]),
                    configData.convertObjectToArray(configData.objectChartData.laffp_chart[1]),
                    configData.convertObjectToArray(configData.objectChartData.laffp_chart[2])
                );
            }
        },

        convertObjectToArray: function(objectLiteral){
            var arr = [];
            for (prop in objectLiteral) {
              arr.push(objectLiteral[prop]);
            }
            return arr;
        },

        blueprintChartSeries: function(containerToRenderTo, titleText, subtitleText, chartDataOne, chartDataTwo, chartDataThree){
            var chartMemberContribsSeries = {
                name: 'Member Contributions',
                color: '#002734',
                type: 'column',
                data: chartDataOne
            };

            var chartCityContribsSeries = {
                name: 'City Contributions',
                color: '#377EB8',
                type: 'column',
                data: chartDataTwo
            };

            var chartInvestmentContribsSeries = {
                name: 'Investment Contributions',
                color: '#000000',
                type: 'spline',
                data: chartDataThree
            };

            var dataSeriesContainer = [chartMemberContribsSeries, chartCityContribsSeries, chartInvestmentContribsSeries];

            var charts = [new Highcharts.Chart(
                getSplineChartConfig(containerToRenderTo, titleText, subtitleText, dataSeriesContainer)
            )];

        },

    }
    // end main config function


    // create an instance of the chart
    function getSplineChartConfig(containerToRenderTo, titleText, subtitleText, chartDataArray){

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
            text: subtitleText
        };

        configChart.xAxis = [{
            categories: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012']
        }];

        configChart.yAxis = [{

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
                text: 'Annual pension contributions (in millions)',
                style: {
                    color: '#2B2B2B'
                }
            },

            tickPixelInterval: 50

        }];

        configChart.tooltip = {
            formatter: function(){
                return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
            }
        };

        configChart.legend = {
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
            enabled: true,
            text: 'KPCC'
        };

        configChart.series = chartDataArray;

        return configChart;

    };
    //end function