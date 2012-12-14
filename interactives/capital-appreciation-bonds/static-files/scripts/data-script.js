var jqueryNoConflict = jQuery;
var chart;
var series;
var optionsChart;

// begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
    drawChart();
});
// end

// adds commas to string
function addCommas (nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
// end

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


// function to build html display
function renderDataTableTemplateWith(data) {
    var source = getTemplateAjax('static-files/templates/debt-table.handlebars', function(template) {
        Handlebars.registerHelper('addCommas', function(object) {
            return addCommas(object);
        });
        jqueryNoConflict('#school-debt-details').html(template(data));
    });
}
// end

// create objects from json data
function processData(data) {
    var schoolDistrictValue;
    var bonds = data.objects;
    jqueryNoConflict('#school-district').change(function () {
        jqueryNoConflict('#data-intro-image').fadeOut();
        schoolDistrictValue = jqueryNoConflict('#school-district :selected').val();
        // empty's array
        var testObjects = [];
        var testChartPrincipal = [];
        var testChartInterest = [];
        // begins loop
        for (var i = 0; i < bonds.length; i++) {
            // comparison for select district
            if (bonds[i].issuer === schoolDistrictValue) {
                var myQueriedDataObject = {
                    cab_debt: bonds[i].cab_debt,
                    cab_interest: bonds[i].cab_interest,
                    cab_principal: bonds[i].cab_principal,
                    county: bonds[i].county,
                    debt_to_principal: bonds[i].debt_to_principal,
                    issuer: bonds[i].issuer,
                    maturity_date: bonds[i].maturity_date,
                    maturity_length: bonds[i].maturity_length,
                    sale_date: bonds[i].sale_date,
                    sale_year: bonds[i].sale_year
                };
                testObjects.push(myQueriedDataObject);
            }
            // close if statement

        }
        // close for loop

        var testData = {
            objects: testObjects
        };
        renderDataTableTemplateWith(testData);
        var testTotalInterest = 0;
        var testTotalPrincipal = 0;
        for (i = 0; i < testObjects.length; i++) {
            testTotalInterest += parseFloat(testObjects[i].cab_interest);
            testTotalPrincipal += parseFloat(testObjects[i].cab_principal);
        }
        testChartInterest.push(testTotalInterest);
        testChartPrincipal.push(testTotalPrincipal);
        if (!chart) chart = new Highcharts.Chart(optionsChart);
        chart.series[0].setData(testChartInterest);
        chart.series[1].setData(testChartPrincipal);
    });
}
// end

// function to grab data
function retriveData() {
    jqueryNoConflict.getJSON('static-files/data/cab_data.json', processData);
}
// end

// confugures the chart options
function drawChart () {

    optionsChart = {
        chart: {
            renderTo: 'school-debt-chart',
            backgroundColor: 'none',
            //zoomType: 'xy',
            type: 'column'
        },
        title: {
            text: 'Capital Appreciation Bonds',
            style: {
                fontFamily: '"proxima-nova", "Helvetica Neue", Helvetica, Arial, sans-serif;',
                fontSize: '20px',
                color: '#2B2B2B'
            }
        },
        xAxis: {
            categories: ['Sum of Capital Appreciation Bonds Issued since 2007']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Bond Payoff Amount'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: '#000000'
                },
                formatter: function() {
                    return '<strong>Total Payoff: </strong>$' + Highcharts.numberFormat(this.total, 2, '.');
                }
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 30,
            y: 10,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 0,
            shadow: true
        },
        credits: {
            enabled: false,
            text: 'California State Treasurer\'s Office',
            href: 'http://www.treasurer.ca.gov/'
        },
        tooltip: {
            enabled: false,
            formatter: function() {
                return '<strong>' + this.series.name + '</strong>: <br \> $' + Highcharts.numberFormat(this.y, 2, '.');
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    fontWeight: 'bold',
                    formatter: function() {
                        return '<strong>' + this.series.name + '</strong>: <br \> $' + Highcharts.numberFormat(this.y, 2, '.');
                    }
                }
            }
        },
        series: [{
            name: 'Total Bond Interest',
            color: '#D7301F'
        }, {
            name: 'Total Bond Principal',
            color: '#FDCC8A'
        }]
    };
}
// end

// generates iframe embed code
function embedBox () {
    var embed_url = '#';
    jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"' + embed_url + '\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
}
// end