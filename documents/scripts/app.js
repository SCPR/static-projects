window.sizeDocContainer = function(){
    var docConfig = {};
    if (navigator.userAgent.match(/(iPad)/i)) {
        docConfig.sidebarParam = false;
        docConfig.docHeightParam = 720;
    } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
        docConfig.sidebarParam = false;
        docConfig.docHeightParam = 440;
    } else {
        docConfig.sidebarParam = false;
        docConfig.docHeightParam = 1020;
    };
    docConfig.initialWidthParam = $("#document-container").width();
    return docConfig;
};


App.Router = Backbone.Router.extend({
    initialize: function(){

        // hack fallback for existing embeds
        if (window.location.search != ""){
            this.redirectDocId = window.location.search.replace("?doc=", "").replace("?=embed/", "");
            Backbone.history.loadUrl("#document=" + this.redirectDocId + "?=embed/");
        };

        //console.log(document.referrer);
        window.appConfig.parentUrl = document.referrer;
        //console.log(window.appConfig);

        this.applicationWrapper = new App.Views.ApplicationWrapper();
        return this.applicationWrapper;
    },

    routes: {
        "": "renderDocumentList",
        //":docId/#annotation/:annotation(/)": "renderDocumentAnnotations",
        ":docId(/)": "renderDocumentInstance",
        ":docId/?=embed(/)": "renderDocumentInstance",
    },


    renderDocumentList: function(){
        //console.log("renderDocumentList - List all of the documents or handle this appropriately");
        //window.appConfig.project_root = window.location.href;
    },

    renderDocumentInstance: function(docId){
        if (this.documentInstance){
            this.documentInstance.remove();
        };

        var document = docId.split("=")
        var instanceConfig = window.sizeDocContainer();
        instanceConfig.docId = document[1].replace("?", "");
        window.appConfig.project_embed = window.appConfig.project_root + "#document=" + instanceConfig.docId + "/?=embed/";

        //Backbone.history.root = window.appConfig.project_root + "#document=" + instanceConfig.docId + "/";
        //console.log(Backbone.history);
        //console.log(Backbone.history.root);

        this.documentInstance = new App.Views.DocumentInstance(instanceConfig);
        return this.documentInstance;
    },

    /*
    renderDocumentAnnotations: function(docId, annotation){
        console.log("renderDocumentAnnotations");
        if (this.annotatedView){
            this.annotatedView.remove();
        };
        var instanceConfig = window.sizeDocContainer();
        instanceConfig.docId = docId;
        instanceConfig.annotation = annotation;
        $.getJSON(window.docCloudApiPrefix + docId + ".json", window.populateDocumentMeta);
        this.annotatedView = new App.Views.AnnotationView(instanceConfig);
        return this.annotatedView;
    }
    */

});


App.Views.DocumentInstance = Backbone.View.extend({
    initialize: function(instanceConfig){
        instanceConfig.docDiv = "DV-viewer-" + instanceConfig.docId;
        instanceConfig.docJson = "https://www.documentcloud.org/api/documents/" + instanceConfig.docId + ".json";
        instanceConfig.docJs = "https://www.documentcloud.org/documents/" + instanceConfig.docId + ".js";
        instanceConfig.docContainer = "#" + instanceConfig.docDiv;
        this.render(instanceConfig);
    },
    render: function(instanceConfig){
        $.getJSON(instanceConfig.docJson, window.populateDocumentMeta);
        $("#document-container").html("<div id=\"" + instanceConfig.docDiv + "\" class=\"DV-container\"></div>");
        window.loadDocumentInstance(instanceConfig);
    }
});


/*
App.Views.AnnotationView = Backbone.View.extend({
    el: "#document-container",
    initialize: function(instanceConfig){
        console.log("AnnotationView");
        this.instanceConfig = instanceConfig;
        this.instanceConfig.docDiv = "DV-viewer-" + this.instanceConfig.docId;
        this.instanceConfig.docUrl = "//www.documentcloud.org/documents/" + this.instanceConfig.docId + ".js";
        this.instanceConfig.docContainer = "#DV-viewer-" + this.instanceConfig.docId;
        this.render(this.instanceConfig);
    },
    events: {
        "click .DV-permalink": "evaluate",
        "click .DV-annotationTitle": "evaluate",
    },
    evaluate: function(e){
        console.log(e);
        console.log("clicked");
        console.log(this.instanceConfig);
        e.preventDefault();
        window.app.navigate(this.instanceConfig.docId + "/#annotation/" + this.instanceConfig.annotation, {
            trigger: true,
            replace: false,
        });
    },
    render: function(instanceConfig){
        $("#document-container").html("<div id=\"" + instanceConfig.docDiv + "\" class=\"DV-container\"></div>");
        window.loadDocumentInstance(instanceConfig);
    }
});
*/


window.loadDocumentInstance = function(instanceConfig){
    //console.log(DV.Schema.helpers.bindEvents);
    var documentInstance = DV.load(instanceConfig.docJs, {
        width: instanceConfig.initialWidthParam,
        height: instanceConfig.docHeightParam,
        sidebar: instanceConfig.sidebarParam,
        text: true,
        pdf: true,
        showAnnotations: false,
        responsive: true,
        container: instanceConfig.docContainer
    });
    return documentInstance;
};


window.populateDocumentMeta = function(data){
    $(".projects-share a.facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + data.document.resources.published_url);
    $(".projects-share a.twitter").attr("href", "http://twitter.com/share?text=View a document: " + data.document.title + "&url=" + data.document.resources.published_url);

    // update the page title
    $("#maintitle").text(data.document.title);

    // update the page metadata
    $("meta[property='og:title']").attr("content", data.document.title);
    $("meta[name='twitter:title']").attr("content", data.document.title);
    $("meta[name=description]").attr("content", data.document.description);
    $("meta[property='og:description']").attr("content", data.document.description);
    $("meta[name='twitter:description']").attr("content", data.document.description);
    $("meta[property='og:url']").attr("content", data.document.resources.published_url);
    $("meta[name='twitter:url']").attr("content", data.document.resources.published_url);

    // pull topic if there's a topic key/value specified
    if (_.has(data.document.data, "topic") === true){
        $(".headlines").html(
            "<h4 class='kicker'>" + data.document.data.topic + "</h4>" +
            "<h3>" + data.document.title + "</h3>"
        );
    } else {
        $(".headlines").html(
            "<h3>" + data.document.title + "</h3>"
        );
    }

    // pull document description
    $(".doc-description").html("<p>" + data.document.description + "</p>");

    // pull document credits
    $(".credits").html("Produced by KPCC staff");

    // pull document created or updated
    if (data.document.updated_at != null || data.document.updated_at != undefined){
        $(".pubdate").html("Updated " + moment(data.document.updated_at).format("MMM D, YYYY"));
    } else {
        $(".pubdate").html("Published " + moment(data.document.created_at).format("MMM D, YYYY"));
    }

    // pull document source if present
    if (data.document.source != null){
        $(".source").html("<strong>Source(s): </strong>" + data.document.source + ". ");
    }

    // pull link to full document
    if (data.document.resources.published_url != null || data.document.resources.published_url != undefined){
        $(".full-document").html("<strong>View</strong>: <a href='" + data.document.resources.published_url + "'>Full document</a>");
        $("a.full-screen").attr("href", data.document.resources.published_url);
    } else {
        $(".full-document").remove();
        $("a.full-screen").remove();
    };

    // pull link to related article if present
    if (data.document.resources.related_article != null || data.document.resources.related_article != undefined){
        $("a.read-more").attr("href", data.document.resources.related_article);
    } else {
        $("a.read-more").remove();
    };

    if (window.appConfig.parentUrl === data.document.resources.related_article){
        $("a.read-more").addClass("hidden");
    };
};