var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function() {
    var charts = [new Highcharts.Chart(createChart())];
});

    function createChart() {

        var config = {};

        config.chart = {
            renderTo: optionsConfig.renderToContainer,
            type: 'bar',
            backgroundColor: 'none',
        };

        config.title = {
            text: optionsConfig.title,
        };

        config.subtitle = {
            text: optionsConfig.subtitle,
        };

        config.xAxis = {
            categories: optionsConfig.categories,
            title: {
                text: null
            }
        };

        config.yAxis = {
            title: {
                text: 'Percent of bills vetoed'
            }
        };

        config.tooltip = {
            formatter: function() {
                return 'Gov. ' + this.x + ' vetoed <br /><strong>' + Highcharts.numberFormat(this.y, 2, '.') + '%</strong> of the bills<br />that came to his desk';
            }
        };

        config.legend = {
            enabled: false,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 10,
            y: 0,
            floating: false,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true,
            reversed: true,
            margin: 30
        };

        config.credits = {
            enabled: false,
            text: optionsConfig.credits,
            href: optionsConfig.href
        };

        config.series = optionsConfig.dataSeries;

        return config;
    }