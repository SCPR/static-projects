   var jqueryNoConflict = jQuery;

    // begin main function
    jqueryNoConflict(document).ready(function(){

        retriveData();

        //drawChart();
        //renderYourTemplate();

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
        jqueryNoConflict.getJSON('static-files/data/cab_data.json', createObjectFrom);
    };



    // create objects from json data
    function createObjectFrom(data){

        // loop through data for markers
        for(var i=0; i<data.objects.length; i++){

            // create object
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

            schoolBonds.push(myLoopObject);
        }

        getTemplateAjax('tatic-files/templates/debt-table.handlebars', function(template) {
            jqueryNoConflict('#debt-table-content').html(template(data));
        });





        console.log(data);

    };





/*

    // render template
    function renderYourTemplate(){

        getTemplateAjax('static-files/templates/debt-table.handlebars', function(template) {

            var testData = {
                cab_debt: "19,000,000",
                cab_interest: "1,558,380",
                cab_principal: "17,441,620",
                county: "Orange",
                debt_to_principal: "1.09",
                issuer: "Irvine Unified School District CFD No 06-1",
                maturity_date: "3/1/2009",
                maturity_length: "1.8",
                sale_date: "5/31/2007",
                sale_year: "2007"
            }

            jqueryNoConflict('#debt-table-content').html(template(testData));

        })

    };
    // end
*/
























    //begin function
    function drawChart(){

        var chart = new Highcharts.Chart({
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
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
                text: 'Example.com',
                href: 'http://www.example.com'
            },

            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'+
                        'Total: '+ this.point.stackTotal;
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },

            series: [{
                name: 'Interest',
                color: '#D7301F',
                data: [500000000]
            }, {
                name: 'Principal',
                color: '#FDCC8A',
                data: [200000000]
            }]
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