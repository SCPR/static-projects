var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.determineDataSource(appConfig.dataSource);
});

// application configuration object
var appConfig = {

    // embedding settings
    embed_this: true,
    embed_url_root: 'http://projects.scpr.org/static/charts/reaction-to-henry-waxmans-retirement',

    // use flat-file or spreadsheet
    dataSource: 'spreadsheet',

    // enter path to the data source below
    spreadsheetKey: '0Aq8qwSArzKP9dHctYkpCVTRJQVJOejJmc0FEM0p1YlE',
    flatFile: 'data'
};

// begin data configuration object
var fn = {

    determineDataSource: function(dataSource){
        if (dataSource === 'spreadsheet'){
            fn.retrieveTabletopData(appConfig.spreadsheetKey);
        } else {
            fn.retrieveFlatData(appConfig.flatFile);
        };
    },

    retrieveTabletopData: function(spreadsheetKey){
        Tabletop.init({
            key: spreadsheetKey,
            callback: fn.processData,
            simpleSheet: true
        });
    },

    retrieveFlatData: function(flatFile){
        jqueryNoConflict.getJSON(flatFile, fn.processData);
    },

    processData: function(data){
        var handlebarsData = {
            objects: data
        }

        fn.renderDataVisualsTemplate(handlebarsData);
    },

    renderDataVisualsTemplate: function(data){
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals', data);
    }
}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');

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