var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveTabletopData();
    fn.displayTimelineFromData(kpccTimelineConfig);
    initializeTemplates.renderStaticTemplates();
});

// begin data configuration object
var fn = {

    retrieveTabletopData: function(){
        Tabletop.init({
            key: kpccTimelineConfig.key,
            callback: fn.displayMetaData,
            simpleSheet: false
        });
    },

    displayMetaData: function(data, tabletop){
        Handlebars.registerHelper('encode', function(context, options) {
            var out = encodeURIComponent(context);
            return out;
        });

        var handlebarsData = {
            objects: data.MetaData.elements
        };

        renderHandlebarsTemplate(proxyPrefix + 'timeline-data-share.handlebars', '.data-share', handlebarsData);
        renderHandlebarsTemplate(proxyPrefix + 'timeline-data-details.handlebars', '.data-details', handlebarsData);
    },

    displayTimelineFromData: function(){
        if (kpccTimelineConfig.dataSource === 'spreadsheet'){
            jqueryNoConflict('.data-visuals').verticalTimeline(kpccTimelineConfig);
        } else if (kpccTimelineConfig.dataSource === 'flat-file'){
            jqueryNoConflict.getJSON(kpccTimelineConfig.sourceFile, function(data) {
                kpccTimelineConfig.data = data;
                $('.data-visuals').verticalTimeline(kpccTimelineConfig);
            });
        } else {
            jqueryNoConflict('.data-visuals').verticalTimeline(kpccTimelineConfig);
        }
    },
}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');

        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 5000);

    },

    renderEmbedBox: function(){
        var embed_url = kpccTimelineConfig.projectDirectory + '/iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
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
// end template rendering object