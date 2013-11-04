var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};

// choose spreadsheet or flat-file
var timelineDataSource = 'spreadsheet';

// example spreadsheet key
var timelineDataSourceKey = '0Aq8qwSArzKP9dDJlU2FoZEVYNUJQRHFXZ2plaF9zN3c';

// example path to file
var timelineDataSourceFile = 'static-files/data/template-timelines_timeline.json';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.displayTimelineFromData(timelineDataSource)
    fn.retrieveTabletopData();
});

// begin data configuration object
var fn = {

    displayTimelineFromData: function(source){
        if (source === 'spreadsheet'){
            fn.timelineFromSpreadsheet(timelineDataSourceKey);
        } else if (source === 'flat-file'){
            fn.timelineFromFlatfile(timelineDataSourceFile);
        } else {
            fn.timelineFromSpreadsheet();
        }
    },

    retrieveTabletopData: function(){
        Tabletop.init({
            key: timelineDataSourceKey,
            callback: fn.displayData,
            simpleSheet: false
        });
    },

    displayData: function(data, tabletop){

        Handlebars.registerHelper('encode', function(context, options) {
            var out = encodeURIComponent(context);
            return out;
        });

        var handlebarsData = {
            objects: data.MetaData.elements
        };

        fn.embedUrl.pathToTimeline = data.MetaData.elements[0].projecturl;
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share', handlebarsData);
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details', handlebarsData);
    },

    timelineFromSpreadsheet: function(timelineDataSourceKey){

        jqueryNoConflict('.data-visuals').verticalTimeline({

            // spreadsheet key
            key: timelineDataSourceKey,

            // name of sheet on spreadsheet
            sheetName: 'Posts',

            // newest or oldest
            defaultDirection: 'newest',

            // collapsed or expanded
            defaultExpansion: 'expanded',

            // groupSegmentByYear or groupSegmentByDecade
            groupFunction: 'groupSegmentByYear',

            // adjust timeline width
            width: '90%'
        });
    },

    timelineFromFlatfile: function(timelineDataSourceFile){

        jqueryNoConflict.getJSON(timelineDataSourceFile, function(data) {
            $('.data-visuals').verticalTimeline({

                data: data,

                // newest or oldest
                defaultDirection: 'newest',

                // collapsed or expanded
                defaultExpansion: 'expanded',

                // groupSegmentByYear or groupSegmentByDecade
                groupFunction: 'groupSegmentByYear',

                // adjust timeline width
                width: '90%'

            });
        });
    },

    embedUrl: {
        pathToTimeline: null
    },

}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');

        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);

    },

    renderEmbedBox: function(){
        var embed_url = fn.embedUrl.pathToTimeline + '/iframe.html';
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