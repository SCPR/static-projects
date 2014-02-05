var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.checkForDataVisuals();
});

// application configuration object
var appConfig = {

    // project text open by default?
    openAboutThis: false,

    // embedding settings
    embed_this: true,
    embed_url_root: 'http://projects.scpr.org/static/test/keller/project-template/project-interactive/',

    // use flat-file or spreadsheet
    dataSource: null,

    // enter path to the data source below
    spreadsheetKey: null,
    flatFile: null
};

// begin data configuration object
var fn = {

    checkForDataVisuals: function(){
        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.data-visuals').length) {
                clearInterval(checkExist);
                fn.createMap();
                fn.createChartWithData();
            }
        }, 1000);
    },

    createMap: function(){

        var initialZoom;

        // set zoom for mobile devices
        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            initialZoom = 7;
        } else {
            initialZoom = 8;
        }

        map = new L.map('content-map-canvas', {
            scrollWheelZoom: false,
            zoomControl: true
        });

        var center = new L.LatLng(35.995785,-117.944584);
        map.setView(center, initialZoom);

        var mapquestUrl = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
             attribution: 'Tiles, data, imagery and map information provided by <a href="http://www.mapquest.com" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
             subdomains: ['otile1','otile2','otile3','otile4']
        });

        map.addLayer(mapquestUrl);
    },

    createChartWithData: function() {

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

        /*
        var slider = new Rickshaw.Graph.RangeSlider({
        	graph: graph,
        	element: jqueryNoConflict('#content-action-slider')
        });
        */

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
            element: document.getElementById('content-action-legend')
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
            var divWidth = jqueryNoConflict('.data-visuals').width();
            graph.configure({
                width: divWidth - 45,
                height: 300
            });
            graph.render();
        }
        window.addEventListener('resize', resize);
        resize();
    }
}
// end data configuration object

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

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals');

        var checkExist = setInterval(function() {

            if (jqueryNoConflict('.header-links').length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict('li.projects-embed').addClass('hidden');
        };
    },

    renderEmbedBox: function(){
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page. You may need to adjust the height parameter. <br /><br /> &lt;iframe src=\"'+ appConfig.embed_url_root +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){

        if (appConfig.openAboutThis === true){
            jqueryNoConflict('.text').collapse('show');
        };

        jqueryNoConflict('.text').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.text').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
    }
}