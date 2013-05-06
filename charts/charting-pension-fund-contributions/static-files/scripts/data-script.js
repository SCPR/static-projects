    var jqueryNoConflict = jQuery;
    var configData = configData || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        configData.initializeDataSource();
        configData.createSliderFilter();

        /* old code
        jqueryNoConflict('a.chart-trigger').click(function (){
            configData.updateChart(this.id);
        });
        */

    });

    // master data configuration object
    var configData = {

        // call data from tabletop
        initializeDataSource: function(){
            Tabletop.init({
                key: '0AjsyCVrBXivzdFBOeDBOMnRJMmpzc3pHLXhhQnVRQVE',
                callback: configData.showInfo,
                parseNumbers: true,
                simpleSheet: false,
                debug: false
            });
        },

        // remove some strings from our data array
        deleteKeyFromObject: function(arrayToClean){
            var cleanedContribsData = [];
            for (var i=0;i<2;i++){
                delete arrayToClean[i].pensioncontributions;
                delete arrayToClean[i].rowNumber;
                cleanedContribsData.push(arrayToClean[i]);
            }
            return cleanedContribsData;
        },

        // holding object we can access later
        objectChartData: {},

        // take tabletop data and render it to a holding object we can access later
        showInfo: function(data, tabletop){
            var wperpClean = configData.deleteKeyFromObject(data.wperp_contribs.elements);
            var lacersClean = configData.deleteKeyFromObject(data.lacers_contribs.elements);
            var laffpClean = configData.deleteKeyFromObject(data.laffp_contribs.elements);
            configData.objectChartData['wperp_chart'] = wperpClean;
            configData.objectChartData['lacers_chart'] = lacersClean;
            configData.objectChartData['laffp_chart'] = laffpClean;
            configData.writeDefaultChart();
        },

        // render the default chart when the page loads
        writeDefaultChart: function(){
            configData.blueprintChartSeries(
                'data-chart',
                'Water and Power Employees Contributions',
                'Source: City of Los Angeles',
                configData.convertObjectToArray(configData.objectChartData.wperp_chart[0]),
                configData.convertObjectToArray(configData.objectChartData.wperp_chart[1])
                //configData.convertObjectToArray(configData.objectChartData.wperp_chart[2])
            );

        },

        /* old code */
        // update the chart when a button is clicked
        /*
        updateChart: function(new_chart){
            if (new_chart === 'wperp_chart'){
                configData.blueprintChartSeries(
                    'data-chart',
                    'Contributions to wperp',
                    'Source:',
                    configData.convertObjectToArray(configData.objectChartData.wperp_chart[0]),
                    configData.convertObjectToArray(configData.objectChartData.wperp_chart[1]),
                    configData.convertObjectToArray(configData.objectChartData.wperp_chart[2])
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
        */

        // convert an object to an array
        convertObjectToArray: function(objectLiteral){
            var arr = [];
            for (prop in objectLiteral) {
              arr.push(objectLiteral[prop]);
            }
            return arr;
        },

        // the blueprint for a chart data
        blueprintChartSeries: function(containerToRenderTo, titleText, subtitleText, chartDataOne, chartDataTwo){
            var chartMemberContribsSeries = {
                name: 'Member Contributions',
                color: '#002734',
                type: 'spline',
                data: chartDataOne
            };

            var chartCityContribsSeries = {
                name: 'City Contributions',
                color: '#377EB8',
                type: 'spline',
                data: chartDataTwo
            };

/*
            var chartInvestmentContribsSeries = {
                name: 'Investment Contributions',
                color: '#000000',
                type: 'spline',
                data: chartDataThree
            };
*/

            var dataSeriesContainer = [chartMemberContribsSeries, chartCityContribsSeries];

            var charts = [new Highcharts.Chart(
                getSplineChartConfig(containerToRenderTo, titleText, subtitleText, dataSeriesContainer)
            )];

        },

        // begin function
        createSliderFilter: function(){

            var increment;

            //creates slider
            jqueryNoConflict("#slider").slider();
            var sliderBar = jqueryNoConflict('#slider');

            // begin slider options
            sliderBar.slider({
                'value':0,
                'min': 1000,
                'max': 3000,
                'step': 1000,

                // displays when user slides the controller
                slide: function(event, ui) {
                    var increment = ui.value;
                    var handle = ui.handle;
                },

                // begin when slider change is made
                change: function(event, ui) {
                    var increment = ui.value;
                    var handle = ui.handle;
                    var valueToEvaulaute = 'chart_' + increment;

                    if (valueToEvaulaute === 'chart_1000'){
                        configData.blueprintChartSeries(
                            'data-chart',
                            'Water and Power Employees Contributions',
                            'Source: Water and Power Employees Pension Fund annual report',
                            configData.convertObjectToArray(configData.objectChartData.wperp_chart[0]),
                            configData.convertObjectToArray(configData.objectChartData.wperp_chart[1])
                        );

                    } else if (valueToEvaulaute === 'chart_2000'){
                        configData.blueprintChartSeries(
                            'data-chart',
                            'LA City Employee Retirement System Contributions',
                            'Source: LA City Employee Retirement System annual report',
                            configData.convertObjectToArray(configData.objectChartData.lacers_chart[0]),
                            configData.convertObjectToArray(configData.objectChartData.lacers_chart[1])
                        );

                    } else {
                        configData.blueprintChartSeries(
                            'data-chart',
                            'LA Fire and Police Pension Fund Contributions',
                            'Source: LA Fire and Police Pension Fund annual report',
                            configData.convertObjectToArray(configData.objectChartData.laffp_chart[0]),
                            configData.convertObjectToArray(configData.objectChartData.laffp_chart[1])
                        );
                    }
                }
                // end slider change is made

          });
            // end slider options

        }

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