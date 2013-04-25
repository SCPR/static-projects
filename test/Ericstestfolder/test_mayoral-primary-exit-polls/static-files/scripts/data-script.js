    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0Aq8qwSArzKP9dGplcDloU0IzM1lNdkVyTkd3RnNsQmc';

    // the sheet being queried
    var dataSheet = 'mayoral_vote_by_religion';

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: processData,
            simpleSheet: false,
            debug: false
        });

    });

    // display data from tabletop
    function processData(data, tabletop){
        var arrayOfCandidates = [];
        var candidateObject = {};

        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {
            candidateObject = {
                //'candidate_name': record.candidate,
                'Catholic': parseFloat(record.catholic),
                'Protestant': parseFloat(record.protestant),
                'Jewish': parseFloat(record.jewish),
                'Agnostic': parseFloat(record.agnostic),
                'None': parseFloat(record.none)
                'Other': parseFloat(record.other)
                
            };

            var targetData = convertObjectKeyValuesTo(candidateObject);

            // push each array to an array
            arrayOfCandidates.push(targetData);

        });

        var garcettiNumbers = {
            name: 'Eric Garcetti',
            color: '#005873',
            type: 'pie',
            data: arrayOfCandidates[0]
        };

        var greuelNumbers = {
            name: 'Wendy Greuel',
            color: '#005873',
            type: 'pie',
            data: arrayOfCandidates[1]
        };

        var jamesNumbers = {
            name: 'Kevin James',
            color: '#005873',
            type: 'pie',
            data: arrayOfCandidates[2]
        };

        var perryNumbers = {
            name: 'Jan Perry',
            color: '#005873',
            type: 'pie',
            data: arrayOfCandidates[3]
        };

        var charts = [];

        charts.push(new Highcharts.Chart(
            getChartConfig('data-chart-one', 'Eric Garcetti', 'March 5 primary breakdown by religion', garcettiNumbers)
        ))

        charts.push(new Highcharts.Chart(
            getChartConfig('data-chart-two', 'Wendy Greuel', 'March 5  primary breakdown by religion', greuelNumbers)
        ))

        charts.push(new Highcharts.Chart(
            getChartConfig('data-chart-three', 'Jan Perry', 'March 5 primary breakdown by religion', perryNumbers)
        ))

        charts.push(new Highcharts.Chart(
            getChartConfig('data-chart-four', 'Kevin James', 'March 5 primary breakdown by religion', jamesNumbers)
        ))

    };

    // convert object to an array of arrays
    function convertObjectKeyValuesTo(assocArray){
        var arrayOfIndividuals = [];
        for (var key in assocArray) {
            if (assocArray.hasOwnProperty(key)) {
              arrayOfIndividuals.push([key, assocArray[key]]);
            }
        }
        return arrayOfIndividuals;
    }

    function getChartConfig(renderId, titleText, subtitleText, data) {

        var config = {};

        config.chart = {
            renderTo: renderId,
            zoomType: 'xy',
            backgroundColor: '#eaeaea',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };

        config.title = {
            text: titleText
        };

        config.subtitle = {
            text: subtitleText
        };

        config.tooltip = {
            formatter: function(){
                return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 2, '.');
            }
        };

        config.plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<strong>' + this.point.name + '</strong>: ' +
                        Highcharts.numberFormat(this.y, 2, '.');
                    }
                }
            }
        };

        config.credits = {
            enabled: true,
            text: 'KPCC'
        };

        config.series = [data];
        return config;
    };