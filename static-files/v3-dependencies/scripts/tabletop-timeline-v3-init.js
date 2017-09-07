var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var proxyPrefix = 'http://projects.scpr.org/static-files/v3-dependencies/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {

    // sets template path
    if (window.location.href.indexOf("http://projects.scpr.org/") > -1){
        window.wrapperTemplatePath = "http://projects.scpr.org/static-files/v3-dependencies/templates/"
    } else if (window.location.href.indexOf("https://projects.scpr.org/") > -1){
        window.wrapperTemplatePath = "https://projects.scpr.org/static-files/v3-dependencies/templates/"
    } else {
        window.wrapperTemplatePath = "/static-files/v3-dependencies/templates/"
    };

    fn.determineDataSource();
    initializeTemplates.renderStaticTemplates();
});

// begin data configuration object
var fn = {

    determineDataSource: function(){
        if (kpccTimelineConfig.dataSource === 'spreadsheet'){
            fn.createTimelineFromSpreadsheet();
        } else if (kpccTimelineConfig.dataSource === 'flat-file'){
            fn.createTimelineFromFlatfile();
        } else {
            fn.createTimelineFromSpreadsheet();
        }
    },

    createTimelineFromSpreadsheet: function(){
        Tabletop.init({
            key: kpccTimelineConfig.key,
            callback: fn.processTabletopData,
            simpleSheet: false
        });
    },

    processTabletopData: function(data){
        fn.displayMetaData(data.MetaData.elements);
        jqueryNoConflict('.data-visuals').verticalTimeline(kpccTimelineConfig);
    },

    createTimelineFromFlatfile: function(){
        jqueryNoConflict.getJSON(kpccTimelineConfig.metaFile, fn.displayMetaData);
        jqueryNoConflict.getJSON(kpccTimelineConfig.sourceFile, function(data) {
            kpccTimelineConfig.data = data;
            $('.data-visuals').verticalTimeline(kpccTimelineConfig);
        });
    },

    displayMetaData: function(data){
        Handlebars.registerHelper('encode', function(context, options) {
            var out = encodeURIComponent(context);
            return out;
        });

        var handlebarsData = {
            objects: data
        };

        renderHandlebarsTemplate(window.wrapperTemplatePath + 'timeline-data-share.handlebars', '.data-share', handlebarsData);
        renderHandlebarsTemplate(window.wrapperTemplatePath + 'timeline-data-details.handlebars', '.data-details', handlebarsData);
    }
}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        renderHandlebarsTemplate(window.wrapperTemplatePath + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(window.wrapperTemplatePath + 'kpcc-footer.handlebars', '.kpcc-footer');

        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 5000);

    },

    hideEmbedBox: function(){
        if (kpccTimelineConfig.embedThis === false){
            jqueryNoConflict('li.projects-embed').addClass('hidden');
        };
    },

    renderEmbedBox: function(){
        var embed_url = kpccTimelineConfig.projectDirectory;
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