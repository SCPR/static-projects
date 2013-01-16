var jqueryNoConflict = jQuery;

    // chart options
    var chart;
    var chartCategories = ['2008', '2009', '2010', '2011'];

//begin main function
jqueryNoConflict(document).ready(function(){
    retriveData();
    drawHighchart();
});
//end main function











// grab data
function retriveData() {
    var dataSource = 'static-files/data/dros_checks_denials_percent.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};

// create projects content template
function renderDataVisualsTemplate(data){
    getTemplateAjax('static-files/templates/data-table.handlebars', function(template) {
        handlebarsDebugHelper();
        jqueryNoConflict('#data-table').html(template(data));
    })
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
}
//end

// add handlebars debugger
function handlebarsDebugHelper(){
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};
// end





// draw the chart
function drawHighchart(){

    var transactionData = [10, 20, 30, 40];
    var denialData = [21, 25, 35, 44];
    var denialPercent = [1.09, .09, .8, .9];

    // objects for highcharts data series
    var drosTransactions = {
        name: 'drosTransactions',
        color: '#A6611A',
        type: 'spline',
        data: transactionData
    };

    // objects for highcharts data series
    var drosDenials = {
        name: 'drosDenials',
        color: '#018571',
        type: 'spline',
        data: denialData
    };

    // objects for highcharts data series
    var denialPercent = {
        name: 'denialPercent',
        color: '#018571',
        type: 'spline',
        data: denialPercent
    };


/*
    var arraysOfTransactions = [];
    arraysOfTransactions.push(transactionData);
    chart.addSeries(drosTransactions);
*/




    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'data-visuals',
            zoomType: 'xy',
            backgroundColor: '#eaeaea'


        },

        title: {
            text: 'Jobs Added To The U.S. Economy (2012)'
        },

        subtitle: {
            text: 'Data Source: Bureau of Labor Statistics'
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
                text: 'Jobs Added',
                style: {
                    color: '#2B2B2B'
                }
            },

            tickPixelInterval: 25

        }],

        tooltip: {
            formatter: function(){
                return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
            }
        },

        // testing various click event options
        plotOptions: {
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

/*
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
*/

                    legendItemClick: function () {
                        var highlightRowId = String(this.name);
                        var selectedRow = 'tr#' + highlightRowId;
                        jqueryNoConflict(selectedRow).toggle();

                         //returning false cancels default action
                        // return false;
                    }
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

        series: [drosTransactions, drosDenials, denialPercent]
    });

};
//end function

// embed function
function embedBox() {
    var embed_url = 'http://projects.scpr.org/static/maps/flu-clinics/iframe.html';

    jAlert('<strong>To embed this visualization your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+ embed_url +'\" width=\"540px\" height=\"600px\" style=\"margin: 0 auto;\" scrolling=\"no\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
}
// end