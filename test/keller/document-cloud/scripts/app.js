var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var embed_url_root = 'http://projects.scpr.org/static/charts/congressional-speeches-on-government-shutdown/';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.loadInitialDoc("//www.documentcloud.org/documents/900190-buchalter-january-2012-contract-with-mark-fabiani.js", "#DV-viewer-900190-buchalter-january-2012-contract-with-mark-fabiani");
    fn.getIdOfClickedElement();
});

// begin data configuration object
var fn = {

    loadInitialDoc: function(docUrl, docContainer){
        DV.load(docUrl, {
            width: 600,
            height: 800,
            sidebar: false,
            text: false,
            container: docContainer
        });
    },

    getIdOfClickedElement: function(){
        jqueryNoConflict('#document-navigation-links a').click(function(){
            var documentId = jqueryNoConflict(this).attr('id');
            var docUrl = "//www.documentcloud.org/documents/" + documentId + ".js";
            var docDiv = "DV-viewer-" + documentId;
            var docContainer = "#DV-viewer-" + documentId;
            var documentId = jqueryNoConflict(this).attr('id');
            jqueryNoConflict('#document-container').empty();
            jqueryNoConflict("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
            fn.loadInitialDoc(docUrl, docContainer);;
        });
    },

    checkForNewContainer: function(docUrl, docContainer){
        var checkExist = setInterval(function() {
            if (jqueryNoConflict(docContainer).length) {
                clearInterval(checkExist);
                console.log('exists');
                //fn.loadInitialDoc(docUrl, docContainer);
            }
        }, 1000);
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
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);

    },

    renderEmbedBox: function(){
        var embed_url = embed_url_root + '/iframe.html';
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