    var jqueryNoConflict = jQuery;
    var configData = configData || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        configData.initializeDataSource();

/*
        jqueryNoConflict('a.chart-trigger').click(function (){
            console.log(configData.dataSheet);
            configData['dataSheet'] = this.id;
            console.log(configData.dataSheet);
            configData.initializeDataSource('this');

        });
*/

    });

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
            for (var i=0;i<2;i++){
                delete arrayToClean[i].pensioncontributions;
                delete arrayToClean[i].rowNumber;
                cleanedContribsData.push(arrayToClean[i]);
            }
            return cleanedContribsData;
        },

        convertObjectToArray: function(objectLiteral){
            var arr = [];
            for (prop in objectLiteral) {
              arr.push(objectLiteral[prop]);
            }
            return arr;
        },

        showInfo: function(data, tabletop){
            var DWP = configData.deleteKeyFromObject(data.dwp_contribs.elements);
            var LACERS = configData.deleteKeyFromObject(data.lacers_contribs.elements);
            var LAFFP = configData.deleteKeyFromObject(data.laffp_contribs.elements);

            configData.blueprintChartSeries(
                'data-chart',
                'Contributions to DWP',
                'Source:',
                configData.convertObjectToArray(DWP[0]),
                configData.convertObjectToArray(DWP[1])
            );

            configData.blueprintChartSeries(
                'data-chart-two',
                'Contributions to LACERS',
                'Source:',
                configData.convertObjectToArray(LACERS[0]),
                configData.convertObjectToArray(LACERS[1])
            );

            configData.blueprintChartSeries(
                'data-chart-three',
                'Contributions to LAFFP',
                'Source:',
                configData.convertObjectToArray(LAFFP[0]),
                configData.convertObjectToArray(LAFFP[1])
            );
        },

        blueprintChartSeries: function(containerToRenderTo, titleText, subtitleText, chartDataOne, chartDataTwo){
            var chartMemberContribsSeries = {
                name: 'Member Contributions',
                color: '#002734',
                data: chartDataOne
            };
            var chartCityContribsSeries = {
                name: 'City Contributions',
                color: '#377EB8',
                data: chartDataTwo
            };

            var dataSeriesContainer = [chartMemberContribsSeries, chartCityContribsSeries];

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
            type: 'spline',
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