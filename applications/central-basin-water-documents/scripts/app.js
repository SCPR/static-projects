var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var embed_this = false;
var embed_url_root = '#';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.checkForNewContainer("DV-viewer-900190-buchalter-january-2012-contract-with-mark-fabiani", "//www.documentcloud.org/documents/900190-buchalter-january-2012-contract-with-mark-fabiani.js", "#DV-viewer-900190-buchalter-january-2012-contract-with-mark-fabiani");
    //fn.getIdOfClickedElement();
});

// begin data configuration object
var fn = {

    checkForNewContainer: function(docDiv, docUrl, docContainer){
        jqueryNoConflict("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");

        var checkExist = setInterval(function() {
            if (jqueryNoConflict(docContainer).length) {
                clearInterval(checkExist);
                fn.loadInitialDoc(docDiv, docUrl, docContainer);
            }
        }, 1000);
    },

    divWidth: jqueryNoConflict('.data-visuals').width(),

    loadInitialDoc: function(docDiv, docUrl, docContainer){

        DV.load(docUrl, {
            width: fn.divWidth,
            height: 900,
            sidebar: true,
            text: false,
            container: docContainer
        });

        var docId = docDiv.replace("DV-viewer-", "");

        //fn.getProjectData();
        //fn.getDocumentNotes(docId);
    },

    getProjectData: function(){
        jqueryNoConflict.getJSON("https://www.documentcloud.org/api/search.json?q=projectid:11842-central_basin", fn.populateSelectMenu);
    },

    populateSelectMenu: function(data){
        for(var i=0; i<data.documents.length; i++){
            //var docAnnotation = "#document/p" + data.document.annotations[i].page + "/a" + data.document.annotations[i].id;
            jqueryNoConflict('#create-document-instance').append("<option value=\"" + data.documents[i].id + "\">" + data.documents[i].title + "</option>");
        };
    },

    getIdOfSelectElement: function(){
        var docId = jqueryNoConflict('#create-document-instance').val();
        var docDiv = "DV-viewer-" + docId;
        var docUrl = "//www.documentcloud.org/documents/" + docId + ".js";
        var docContainer = "#DV-viewer-" + docId;
        jqueryNoConflict("#document-container").html("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
        fn.checkForNewContainer(docDiv, docUrl, docContainer);
    }

    /*
    getDocumentNotes: function(docId){
        var apiPrefix = "https://www.documentcloud.org/api/documents/";
        $.getJSON(apiPrefix + docId + ".json", fn.populateDocumentNotes);
    },

    populateDocumentNotes: function(data){
        jqueryNoConflict('#note-navigation-links').html('');
        if (data.document.annotations.length > 0){
            for(var i=0; i<data.document.annotations.length; i++){
                var docAnnotation = "#document/p" + data.document.annotations[i].page + "/a" + data.document.annotations[i].id;
                jqueryNoConflict('#note-navigation-links').append("<p><a href='" + docAnnotation + "'>" + data.document.annotations[i].title + "</a></p>");
            };
        };
    },

    getIdOfClickedElement: function(){
        jqueryNoConflict('#document-navigation-links a').click(function(event){
            var docId = jqueryNoConflict(this).attr('id');
            var docDiv = "DV-viewer-" + docId;
            var docUrl = "//www.documentcloud.org/documents/" + docId + ".js";
            var docContainer = "#DV-viewer-" + docId;
            jqueryNoConflict("#document-container").html("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
            fn.checkForNewContainer(docDiv, docUrl, docContainer);
        });
    }
    */

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
        if (embed_this === false){
            jqueryNoConflict('li.projects-embed').addClass('hidden');
        };
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