    var jqueryNoConflict = jQuery;

    // begin main function
    jqueryNoConflict(document).ready(function() {

        createChartWithData();

    });

    function createChartWithData() {

        jqueryNoConflict('.dropdown-toggle').dropdown();

        var palette = new Rickshaw.Color.Palette();
        var graph = new Rickshaw.Graph( {
        	element: document.getElementById("chart"),
        	renderer: 'area',
        	//width: 1000,
        	//height: 500,
        	//min: auto,

        	series: [{
                    name: 'Trade, Transportation & Utilities',
                    data: data_trade_transportation_utilities,
                    color: palette.color()
        		},{
                    name: 'Retail Trade',
                    data: data_retail_trade,
                    color: palette.color()
        		},{
            		name: 'Professional Services',
            		data: data_professional_business_services,
            		color: palette.color()
        		},{
            		name: 'Manufacturing',
            		data: data_manufacturing,
            		color: palette.color()
        		},{
                    name: 'Leisure & Hospitality',
                    data: data_leisure_hospitality,
                    color: palette.color()
                },{
                    name: 'Health Care',
                    data: data_health_care,
                    color: palette.color()
                },/*{
                    name: 'Government: State ',
                    data: data_state_government,
                    color: palette.color()
                },{
                    name: 'Government: Local ',
                    data: data_local_government,
                    color: palette.color()
                },*/{
                    name: 'Food & Accommodation',
                    data: data_accommodation_food,
                    color: palette.color()
                },{
            		name: 'Financial Activities',
            		data: data_financial_activities,
            		color: palette.color()
        		},{
        		    name: 'Education',
        		    data: data_educational_services,
                    color: palette.color()
                },{
                    name: 'Construction',
                    data: data_construction,
        			color: palette.color()
        		}
        	]
        });

        var slider = new Rickshaw.Graph.RangeSlider({
        	graph: graph,
        	element: jqueryNoConflict('#slider')
        });

        var x_axis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
            color: 'black',
            timeUnit: (new Rickshaw.Fixtures.Time()).unit('year')
        });

        var y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            orientation: 'right',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            //tickFormat: function(y) {return y},
            element: document.getElementById("y_axis"),
        });

        /*
        var annotator = new Rickshaw.Graph.Annotate({
            graph: graph,
            element: document.getElementById('timeline')
        });

        annotator.add(data_construction[62].x, 'March 2008: JPMorgan Chase agrees to buy Bear Stearns.');
        annotator.add(data_construction[66].x, 'July 2008: Bank of America acquires Countrywide Financial, one of California\'s largest lenders.');
        annotator.add(data_construction[68].x, 'Sept. 2008: Lehman Brothers files for bankruptcy; Federal Reserve bails out AIG');
        annotator.add(data_construction[69].x, 'October 2008: President George W. Bush signs bailout, creating TARP');
        annotator.add(data_construction[70].x, 'November 2008: Barack Obama elected U.S. President');
        annotator.add(data_construction[71].x, 'December 2008: The term "Great Recession" takes hold');
        */

        graph.renderer.unstack = false;
        graph.render();

        var legend = new Rickshaw.Graph.Legend.Custom({
            graph: graph,
            element: document.getElementById('legend')
        });

        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle.Custom({
            graph: graph,
            legend: legend
        });

        var order = new Rickshaw.Graph.Behavior.Series.Order({
            graph: graph,
            legend: legend
        });

        var highlight = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: graph,
            legend: legend
        });

        var hoverDetail = new Rickshaw.Graph.HoverDetail({
        	graph: graph,
            formatter: function(series, x, y) {
                var dateFormat = 'MMMM YYYY';
                var dateOutput = moment(new Date(x * 1000)).format(dateFormat);
                var date = '<span class="date">' + dateOutput + '</span>';
                var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                var content = series.name + '<br />' + date + '<br /><span class="jobs">' + addCommas(parseInt(y)) + ' jobs</span>';
                return content;
            }
        });

        graph.series[0].disable()
        graph.series[1].disable();
        graph.series[2].disable();
        graph.series[3].disable();
        graph.series[4].disable();
        graph.series[5].disable();
        graph.series[6].disable();
        graph.series[7].disable();
        graph.series[8].disable();
        //graph.series[9].disable();
        //graph.series[10].disable();
        //graph.series[11].disable();
        //jqueryNoConflict('.rickshaw_legend .line:nth-child(1)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(2)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(3)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(4)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(5)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(6)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(7)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(8)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(9)').addClass('disabled');
        jqueryNoConflict('.rickshaw_legend .line:nth-child(10)').addClass('disabled');
        //jqueryNoConflict('.rickshaw_legend .line:nth-child(11)').addClass('disabled');
        //jqueryNoConflict('.rickshaw_legend .line:nth-child(12)').addClass('disabled');

        var resize = function() {

            var divWidth = jqueryNoConflict('#chart_container').width();

            graph.configure({
                width: divWidth,
                height: 300
            });
            graph.render();
        }

        window.addEventListener('resize', resize);
        resize();

    }

    // function to add commas
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