   var jqueryNoConflict = jQuery;
   var chart;

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

    // function to build html display
    function buildTemplateWith(data){
        var source = getTemplateAjax('static-files/templates/debt-table.handlebars', function(template) {
            jqueryNoConflict('#school-debt-details').html(template(data));
        });
    };


    // create objects from json data
    function processData(data){

        buildTemplateWith(data);

        // loop through data for markers
        for(var i=0; i<data.objects.length; i++){

            var cab_principal = [parseFloat(data.objects[i].cab_principal)];
            var cab_interest = [parseFloat(data.objects[i].cab_interest)];

/*
            var myLoopObject = {
                cab_debt: data.objects[i].cab_debt,
                cab_interest: data.objects[i].cab_interest,
                cab_principal: data.objects[i].cab_principal,
                county: data.objects[i].county,
                debt_to_principal: data.objects[i].debt_to_principal,
                issuer: data.objects[i].issuer,
                maturity_date: data.objects[i].maturity_date,
                maturity_length: data.objects[i].maturity_length,
                sale_date: data.objects[i].sale_date,
                sale_year: data.objects[i].sale_year

            };
*/

            var testDataPrincipal = {
                name: 'Principal',
                color: '#FDCC8A',
                data: cab_principal
            };

            var testDataInterest = {
                name: 'Interest',
                color: '#D7301F',
                data: cab_interest
            };

        };

        chart.addSeries(testDataInterest);
        chart.addSeries(testDataPrincipal);

    };

    //begin function
    function drawChart(){

        chart = new Highcharts.Chart({
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

            series: []

        });

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