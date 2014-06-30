var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var appConfig = appConfig || {};

// begin main function
jqueryNoConflict(document).ready(function() {

    var urlLink = window.location.href;

    if (urlLink.indexOf("embed") > -1){
        window.appConfig.openAboutThis = false;
    };

    $(window).scroll(function(){

        var barWidth = $("#content-article").width();

        var aboveHeight;

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)){
            aboveHeight = $("#content-action-bar").outerHeight();
        } else {
            aboveHeight = $("header").outerHeight();
        }

        //if scrolled down more than the varibles"s height
        if ($(window).scrollTop() > aboveHeight){

            // if yes, add "fixed" class to the <nav>
            // add padding top to the #content (value is same as the height of the nav)
            $("#content-action-bar").addClass("fixed").css("width", barWidth);

        } else {

            // when scroll up or less than aboveHeight, remove the "fixed" class, and the padding-top
            $("#content-action-bar").removeClass("fixed").css("width", "width: 100%;");
        }
    });

    Swag.registerHelpers(Handlebars);

    initializeTemplates.renderStaticTemplates();

    fn.determineDataSource(appConfig.dataSource);

});

// application configuration object
var appConfig = {
    openAboutThis: true,
    embed_this: true,
    embed_url_root: "http://projects.scpr.org/static/charts/congressional-stance-on-iraq/?=embed/",
    embed_width: "100%",
    embed_height: "850px",

    // use flat-file or spreadsheet
    dataSource: "spreadsheet",
    spreadsheetKey: "0AjsyCVrBXivzdDVma0I4a01iREEyNUQxWHhaN2xzSWc",
    flatFile: null
};

// begin data processing object
var fn = {

    determineDataSource: function(dataSource){
        if (dataSource === "spreadsheet"){
            fn.retrieveTabletopData(appConfig.spreadsheetKey);
        } else {
            fn.retrieveFlatData(appConfig.flatFile);
        };
    },

    retrieveTabletopData: function(spreadsheetKey){
        Tabletop.init({
            key: spreadsheetKey,
            callback: fn.processData,
            simpleSheet: false
        });
    },

    retrieveFlatData: function(flatFile){
        jqueryNoConflict.getJSON(flatFile, function(data){
            fn.renderDataVisualsTemplate(data);
        });
    },

    processData: function(data){
        var handlebarsData = {
            objects: data.updates.elements
        }
        fn.renderDataVisualsTemplate(handlebarsData);
    },

    renderDataVisualsTemplate: function(data){
        console.log(data);
        renderHandlebarsTemplate("templates/content-action-bar.handlebars", "#content-action-bar", data);
        renderHandlebarsTemplate("templates/data-visuals.handlebars", ".data-visuals", data);
    },

    scrollToRep: function(){
        var congressionalMember = jqueryNoConflict("#search-congressional-delegation").val();
        jqueryNoConflict.scrollTo(congressionalMember)
    }

};
// end data processing object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = "http://projects.scpr.org/static/static-files/v3-dependencies/templates/";
        renderHandlebarsTemplate(proxyPrefix + "kpcc-header.handlebars", ".kpcc-header");
        renderHandlebarsTemplate(proxyPrefix + "kpcc-footer.handlebars", ".kpcc-footer");
        renderHandlebarsTemplate("templates/data-share.handlebars", ".data-share");
        renderHandlebarsTemplate("templates/data-details.handlebars", ".data-details");

        var checkExist = setInterval(function() {

            if (jqueryNoConflict(".header-links").length) {
                clearInterval(checkExist);
                initializeTemplates.hideEmbedBox();
            }

            if (jqueryNoConflict(".buttons").length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);
    },

    hideEmbedBox: function(){
        if (appConfig.embed_this === false){
            jqueryNoConflict("li.projects-embed").addClass("hidden");
        };
    },

    renderEmbedBox: function(){
        jAlert("<h4>Embed this on your site or blog</h4><span>Copy this code and paste to source of your page. You may need to adjust the height parameter.<br /><br /><textarea>&lt;iframe src='" + appConfig.embed_url_root + "' width='" + appConfig.embed_width + "' height='" + appConfig.embed_height + "' style='margin: 0 3% 0 3%;' frameborder='no'&gt;&lt;/iframe></textarea>");
    },

    toggleDisplayIcon: function(){
        jqueryNoConflict(".text").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.text").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".text").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.text").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("shown.bs.collapse", function(){
            jqueryNoConflict("span.about").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        });
        jqueryNoConflict(".about").on("hidden.bs.collapse", function(){
            jqueryNoConflict("span.about").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
        });

        if (appConfig.openAboutThis === true){
            $(".text").collapse("show");
        };

    }
};
// end template rendering object