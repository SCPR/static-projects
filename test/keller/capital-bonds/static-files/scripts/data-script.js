    var jqueryNoConflict = jQuery;

    // begin main function
    jqueryNoConflict(document).ready(function(){

        drawChart();

    });
    // end


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