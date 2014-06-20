var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {

    var urlLink = window.location.href;
    if (urlLink.indexOf("embed") > -1){
        appConfig.openAboutThis = false;
    };

    initializeTemplates.renderStaticTemplates();
});

// application configuration object
var appConfig = {
    openAboutThis: true,
    embed_this: false,
    embed_url_root: "http://projects.scpr.org/static/charts/sentiments-la-parking/?=embed/",
    embed_width: "100%",
    embed_height: "850px"
};

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
        jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + appConfig.embed_url_root + "' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 3% 0 3%;' frameborder='no'&gt;&lt;/iframe></textarea>");
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

        if (appConfig.openAboutThis === true){
            $('.text').collapse('show');
        };

    }
};
// end template rendering object