   var jqueryNoConflict = jQuery;
   var chart;
   var series;
   var optionsChart;

    // begin main function
    jqueryNoConflict(document).ready(function(){
        retriveData();
        drawChart();

    });
    // end

    // render handlebars templates via ajax
    function getTemplateAjax(path, callback) {
        var source;
        var template;

        jqueryNoConflict.ajax({
            url: path,
                success: function(data) {
                    source = data;
                    template = Handlebars.compile(source);
                        if (callback) callback(template);
                }
        });
    };
    //end

    // function to grab data
    function retriveData() {
        jqueryNoConflict.getJSON('static-files/data/cab_data.json', processData);

    };
    // end

    // function to build html display
    function buildTemplateWith(data){
        var source = getTemplateAjax('static-files/templates/debt-table.handlebars', function(template) {
            jqueryNoConflict('#school-debt-details').html(template(data));
        });
    };
    // end


    // create objects from json data
    function processData(data){

        // structure handlebars data like this
        /*
        var testData = {"testObjects": [{"cab_principal": "17441620", "debt_to_principal": "1.09", "maturity_date": "3/1/2009", "county": "Orange", "sale_date": "5/31/2007", "cab_interest": "1558380", "sale_year": "2007", "cab_debt": "19000000", "issuer": "Irvine Unified School District CFD No 06-1", "maturity_length": "1.8"}, {"cab_principal": "61577670", "debt_to_principal": "1.25", "maturity_date": "9/1/2011", "county": "Orange", "sale_date": "6/13/2007", "cab_interest": "15422330", "sale_year": "2007", "cab_debt": "77000000", "issuer": "Tustin Unified School District CFD No 07-1", "maturity_length": "4.2"}]};
        buildTemplateWith(testData);
        */

        var schoolDistrictValue;
        var bonds = data.objects;
        var testObjects = [];
        var testChartInterest0 = [];
        var testChartPrincipal1 = [];

        $('#school-district').change(function(){
            schoolDistrictValue = $('#school-district :selected').val();

                // empty's array
                testObjects = [];

                // begins loop
                for(var i=0; i<bonds.length; i++){

                    // comparison for select district
                    if (bonds[i].issuer === schoolDistrictValue) {

                        var chartInterest = parseFloat(bonds[i].cab_interest);
                        var chartPrincipal = parseFloat(bonds[i].cab_principal);

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
                        testChartInterest0.push(chartInterest);
                        testChartPrincipal1.push(chartPrincipal);

                    }
                    // close if statement

                };
                // close for loop


            var testData = {
                objects: testObjects
            };

            buildTemplateWith(testData);

            if(!chart)
                chart = new Highcharts.Chart(optionsChart);
                chart.series[0].setData(testChartInterest0)
                chart.series[1].setData(testChartPrincipal1)

        });

    };
    // end







    //begin function
    function drawChart(){

        optionsChart = {
            chart: {
                renderTo: 'school-debt-chart',
                backgroundColor: 'none',
                //zoomType: 'xy',
                type: 'column'
            },

            title: {
                text: 'Alhambra Unified',
                style: {
                    fontFamily: '"proxima-nova", "Helvetica Neue", Helvetica, Arial, sans-serif;',
                    fontSize: '20px',
                    color: '#2B2B2B'
                }
            },

            xAxis: {
                categories: ['Total CAB Amount']
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
                        return '<strong>Total:</strong> $' +
                        Highcharts.numberFormat(this.total, 2, '.');
                    },
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
                text: 'Example.com',
                href: 'http://www.example.com'
            },


            tooltip: {
                enabled: false,
                formatter: function() {
                    return '<strong>'+ this.series.name +
                    '</strong>: $' + Highcharts.numberFormat(this.y, 2, '.');
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        fontWeight: 'bold',
                        formatter: function () {
                            return '<strong>' + this.series.name +
                            '</strong>: $' + Highcharts.numberFormat(this.y, 2, '.');
                        },
                    }
                }

            },

            series: [{
                name: 'Interest',
                color: '#D7301F'
            }, {
                name: 'Principal',
                color: '#FDCC8A'
            }]

/*
            series: [{
                name: 'Interest',
                color: '#D7301F',
                data: 300000
            }, {
                name: 'Principal',
                color: '#FDCC8A',
                data: 300000
            }]
*/

        };

    };
    // end














    // function to add commas to string
    function addCommas(nStr){
    	nStr += '';
    	x = nStr.split('.');
    	x1 = x[0];
    	x2 = x.length > 1 ? '.' + x[1] : '';
    	var rgx = /(\d+)(\d{3})/;
    	while (rgx.test(x1)) {
    		x1 = x1.replace(rgx, '$1' + ',' + '$2');
    	}
    	return x1 + x2;
    };
    // end

    // function to generate iframe embed code
    function embedBox() {
        var embed_url = '#';
        jAlert('<strong>To embed this on your blog or site, just copy this code:<br></strong>&lt;iframe src=\"'+
        embed_url +
        '\" width=\"420px\" height=\"450px\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
    };
    // end