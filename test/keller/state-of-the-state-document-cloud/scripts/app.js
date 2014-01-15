var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var embed_this = false;
var embed_url_root = '#';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.checkForNewContainer("DV-viewer-1005633-california-2013-state-of-state-address", "//www.documentcloud.org/documents/1005633-california-2013-state-of-state-address.js", "#DV-viewer-1005633-california-2013-state-of-state-address");
    //fn.getIdOfClickedElement();

    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

});

// begin data configuration object
var fn = {

    categoryObjectArray: [],

    checkForNewContainer: function(docDiv, docUrl, docContainer){
        //jqueryNoConflict(".progress-list").removeClass("hidden");
        jqueryNoConflict("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
        var checkExist = setInterval(function() {
            if (jqueryNoConflict(docContainer).length) {
                clearInterval(checkExist);
                fn.loadInitialDoc(docDiv, docUrl, docContainer);
            }
        }, 1000);
    },

    loadInitialDoc: function(docDiv, docUrl, docContainer){

        var sidebarParam;
        var docHeightParam;

        // set params for mobile devices
        if (navigator.userAgent.match(/(iPad)/i)) {
            sidebarParam = false;
            docHeightParam = 700;
        } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
            sidebarParam = false;
            docHeightParam = 400;
        } else {
            sidebarParam = false;
            docHeightParam = 1820;
        };

        var initialWidth = jqueryNoConflict('#document-container').width();

        DV.load(docUrl, {
            width: initialWidth,
            height: 1000,
            sidebar: sidebarParam,
            text: false,
            pdf: false,
            container: docContainer
        });

        var docId = docDiv.replace("DV-viewer-", "");

        fn.getDocumentNotes(docId);
    },

    getDocumentNotes: function(docId){
        var apiPrefix = "https://www.documentcloud.org/api/documents/";
        $.getJSON(apiPrefix + docId + ".json", fn.populateDocumentNotes);
    },

    populateDocumentNotes: function(data){
        jqueryNoConflict('#note-navigation-links').html('');

        //console.log(data.document);

        var documentDescription;

        var annotationCategoryKeys = [];


        if (data.document.description){
            documentDescription = "<p><em><strong>About this</strong></em>: " + data.document.description + "</p>";
        } else {
            documentDescription = "<p></p>"
        };

        if (data.document.annotations.length > 0){
            jqueryNoConflict('#note-navigation-links').empty();
            jqueryNoConflict('#document-meta-data').html(
                "<h6>" + data.document.title + "</h6>" + documentDescription +
                "<p><em><strong>Source</strong></em>: " + data.document.source + "</p>" +
                "<p><em><strong>See what Brown had to say about</strong></em>:</p>"
            );

            for(var i=0; i<data.document.annotations.length; i++){
                var annotationCategory = data.document.annotations[i].title.split(":");
                annotationCategoryKeys.push(annotationCategory[0].toProperCase());
                var docAnnotation = "#document/p" + data.document.annotations[i].page + "/a" + data.document.annotations[i].id;

                //jqueryNoConflict('#note-navigation-links').append("<p><a href='" + docAnnotation + "'>" + data.document.annotations[i].title + "</a></p>");

            };

            var testannotationCategories = _.uniq(annotationCategoryKeys, true)
            for (var t=0; t<testannotationCategories.length; t++){
                var categoryObjectClass = {
                    category: annotationCategoryKeys[t].replace(" ", "-"),
                    notes: fn.createArrayOfNotes(annotationCategoryKeys[t], data)
                };
                fn.categoryObjectArray.push(categoryObjectClass);
            }

        } else {
            jqueryNoConflict('#note-navigation-links').empty();
            jqueryNoConflict('#document-meta-data').html(
                "<h6>" + data.document.title + "</h6>" +
                documentDescription +
                "<p><em><strong>Source</strong></em>: " + data.document.source + "</p>" +
                "<p><strong>This document does not have annotations</strong></p>"
            );
        };

        jqueryNoConflict(".progress-list").addClass("hidden");

    },



    createArrayOfNotes: function(comparison, data){
        var notesArray = [];


        console.log(data);

        var annotationCategory = comparison.split(":");

        console.log(annotationCategory);

        for(var i=0; i<data.length; i++){

            console.log(data[i].annotations);


            if (annotationCategory === data[i].title){
                notesArray.push(data[i]);
            }
        };
        console.log(notesArray);
        return notesArray;
    },






    getIdOfSelectElement: function(){
        jqueryNoConflict('#note-navigation-links').empty();
        jqueryNoConflict('#document-meta-data').empty();
        var docId = jqueryNoConflict('#create-document-instance').val();
        var docDiv = "DV-viewer-" + docId;
        var docUrl = "//www.documentcloud.org/documents/" + docId + ".js";
        var docContainer = "#DV-viewer-" + docId;
        jqueryNoConflict("#document-container").html("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
        fn.checkForNewContainer(docDiv, docUrl, docContainer);
    },

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