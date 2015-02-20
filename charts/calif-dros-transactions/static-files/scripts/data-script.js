var jqueryNoConflict = jQuery;

// data containers
var chartCategories = [];
var transactionData = [];
var handgunData = [];
var longgunData = [];

//begin main function
jqueryNoConflict(document).ready(function(){
    retriveData();
    processData();
});
//end main function

// grab data
function retriveData(data) {
    var dataSource = 'static-files/data/dros_checks_denials_percent.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

function processData(data) {
    var dataSource = 'static-files/data/dros_checks_denials_percent.json';
    jqueryNoConflict.getJSON(dataSource, processDataForChart);
}

// create projects content template
function renderDataVisualsTemplate(data){
    renderHandlebarsTemplate('static-files/templates/data-visuals.handlebars', '#data-visuals', data);
};

// process data to display in chart
function processDataForChart(data){

    jqueryNoConflict.each(data.objects, function(i, item) {
        chartCategories.push(item.Year);
        transactionData.push(item.Dros_total_transactions);
        handgunData.push(item.Dros_handguns);
        longgunData.push(item.Dros_longguns);
    });

    if (document.getElementById('data-chart')) {
        console.log('creating chart');
        drawHighchart();

    } else {

      setTimeout(function() {
            console.log('waiting a second and will create chart');
            drawHighchart();
        }, 1000);
    }
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};

// render handlebars template function
function renderHandlebarsTemplate(withTemplate,inElement,withData){
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// draw the chart
function drawHighchart(){

    // objects for highcharts data series
    var drosTransactions = {
        name: 'Total Transactions',
        color: '#002734',
        type: 'line',
        data: transactionData
    };

    // objects for highcharts data series
    var drosHandguns = {
        name: 'Handgun Transactions',
        color: '#005873',
        type: 'area',
        data: handgunData
    };

    // objects for highcharts data series
    var drosLonggun = {
        name: 'Rifle/shotgun Transactions',
        color: '#00B9F3',
        type: 'area',
        data: longgunData
    };

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'data-chart',
            zoomType: 'xy',
            backgroundColor: '#eaeaea',
            type: 'spline',
            marginTop: 50,
            marginBottom: 50
        },

        title: {
            text: 'Firearm transactions processed by the California Department of Justice (1991-2011)'
        },

        subtitle: {
            text: '',
        },

        xAxis: [{
            categories: chartCategories
        }],

        yAxis: [{

            // primary axis
            labels: {
               formatter: function() {
                    return this.value / 1000 +'k';
                },
                style: {
                    color: '#2B2B2B'
                }
            },
            title: {
                text: 'Dealer Transactions',
                style: {
                    color: '#2B2B2B'
                }
            },

            //max: 650000,
            tickPixelInterval: 100

        }],

        tooltip: {
            formatter: function() {
                return '<strong>' + this.x + '</strong><br />' +
                Highcharts.numberFormat(this.y, 0, '.') +
                ' Transactions';
            }
        },

        // testing various click event options

        plotOptions: {

            area: {
                stacking: 'normal',
                //pointStart: 1991,
                //pointInterval: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }

/*
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


                    legendItemClick: function () {
                        var highlightRowId = String(this.name);
                        var selectedRow = 'tr#' + highlightRowId;
                        jqueryNoConflict(selectedRow).toggle();

                         //returning false cancels default action
                        // return false;
                    }
                }
            }
*/
        },

        legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            //x: 0,
            y: 15,
            floating: false,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },

        credits: {
            enabled: false,
            text: 'Source: California Dept. of Justice Bureau of Firearms',
            href: 'http://oag.ca.gov/sites/all/files/pdfs/firearms/forms/dros_chart.pdf?',
            position: {
                align: 'right',
                verticalAlign: 'bottom',
                y: -5
            }
        },

        series: [drosTransactions, drosHandguns, drosLonggun]
    });

};
//end function

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
}
// end