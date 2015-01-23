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
    embed_url_root: 'http://projects.scpr.org/static/interactives/2015-academy-awards-preview/',

    // use flat-file or spreadsheet
    dataSource: 'spreadsheet',

    // enter path to the data source below
    spreadsheetKey: '0Aq8qwSArzKP9dEJNQjhYREtjU2lGLVcwYkNBRlQwMVE',
    flatFile: 'data/2014_oscars_prediction_data_handlebars.json'
};

// begin data processing object
var fn = {
    categoryObjectArray: [],

    nomineeObjectClass: {
        category: null,
        movieimage: null,
        awardswon: null,
        nominee: null,
        imdbpage: null,
        predictionsource: null,
        movie: null,
        officialsite: null,
        prediction: null,
        predictionlink: null,
        trailer: null,
    },

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
            callback: fn.filterAwardCategories,
            simpleSheet: true
        });
    },

    retrieveFlatData: function(flatFile){
        jqueryNoConflict.getJSON(flatFile, function(data){
            fn.filterAwardCategories(data.objects);
        });
    },

    filterAwardCategories: function(data){
        var nominationCategoryKeys = [];
        for(var i=0; i<data.length; i++){
            nominationCategoryKeys.push(data[i].category);
        }
        fn.createCategoryObjects(_.uniq(nominationCategoryKeys, true), data);
    },

    createCategoryObjects: function(array, data){
        for(var i=0; i<array.length; i++){
            var slug = array[i].toLowerCase().replace(/\s/g, '-');
            var categoryObjectClass = {
                category: array[i],
                categorySlug: slug,
                nominees: fn.createArrayOfNominees(array[i], data)
            };
            fn.categoryObjectArray.push(categoryObjectClass);
        }
        var handlebarsData = {
            objects: fn.categoryObjectArray
        }
        fn.renderDataVisualsTemplate(handlebarsData);
    },

    createArrayOfNominees: function(comparison, data){
        var nomineeArray = [];
        for(var i=0; i<data.length; i++){
            if (comparison === data[i].category){
                nomineeArray.push(data[i]);
            }
        };
        return nomineeArray;
    },

    renderDataVisualsTemplate: function(data){
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals', data);
        fn.calculateHeights();
    },

    calculateHeights: function(){
        var checkExist = setInterval(function() {
            if (jqueryNoConflict(".data-visuals").length) {
                clearInterval(checkExist);
                var categoryRows = []
                $(".elements").each(function (){
                    categoryRows.push(this.id);
                });
                jqueryNoConflict.each(categoryRows, function(index, value){
                    var targetElementId = "#" + value;
                    var test = fn.getHighestHeight(targetElementId);
                    var desiredHeight = 15 + Math.max.apply(Math, test);
                    jqueryNoConflict(targetElementId + " .nominee-container").css('height', desiredHeight);
                });
            }
        }, 1000);
    },

    getHighestHeight: function(targetElementId){
        var heights = [];
        jqueryNoConflict(targetElementId).children().each(function(){
            var new_height = jqueryNoConflict(this).outerHeight();
            heights.push(new_height)
        });
        return heights;
    }
};
// end data processing object

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
};
// end template rendering object