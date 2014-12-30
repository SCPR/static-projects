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
        docConfig.initialWidth = $("#document-container").width();
        return docConfig;
    };


    window.populateDocumentMeta = function(data){
        window.appConfig.twitter_share_text = "View a document: " + data.document.title;
        $("#maintitle").text(data.document.title);
        $("meta[property='og:title']").attr("content", data.document.title);
        $("meta[name='twitter:title']").attr("content", data.document.title);
        $("meta[name=description]").attr("content", data.document.description);
        $("meta[property='og:description']").attr("content", data.document.description);
        $("meta[name='twitter:description']").attr("content", data.document.description);
        $("meta[property='og:url']").attr("content", data.document.resources.published_url);
        $("meta[name='twitter:url']").attr("content", data.document.resources.published_url);
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
        $(".doc-description").html("<p>" + data.document.description + "</p>");
        $(".credits").html("Produced by KPCC staff");
        $(".pubdate").html("Updated " + moment(data.document.updated_at).format("MMM D, YYYY"));
        if (data.document.source != null){
            $(".source").html("<strong>Source(s): </strong>" + data.document.source + ". ");
        }

        $(".full-document").html("<strong>View</strong>: <a href='" + data.document.resources.pdf + "'>Full document</a>");

        if (data.document.resources.related_article != window.appConfig.parentUrl && data.document.resources.related_article != null){
            $("a.read-more").attr("href", data.document.resources.related_article);
        } else{
            $("a.read-more").addClass("hidden");
        }

    };


    window.loadDocumentInstance = function(instanceConfig){
        var documentInstance = DV.load(instanceConfig.docUrl, {
            width: instanceConfig.initialWidth,
            height: instanceConfig.docHeightParam,
            sidebar: instanceConfig.sidebarParam,
            text: true,
            pdf: true,
            responsive: true,
            container: instanceConfig.docContainer
        });
        return documentInstance;
    };


    App.Router = Backbone.Router.extend({
        initialize: function(){

            console.log(window.appConfig);

            window.docCloudApiPrefix = "https://www.documentcloud.org/api/documents/";
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderDocumentList",
            //":docId/#annotation/:annotation(/)": "renderDocumentAnnotations",
            ":docId/?=embed(/)": "renderDocumentInstance",
            ":docId(/)": "renderDocumentInstance"
        },

        renderDocumentList: function(){

            //console.log("renderDocumentList - List all of the documents right?");

        },

        renderDocumentInstance: function(docId){
            console.log("renderDocumentInstance");

            if (this.documentInstance){
                this.documentInstance.remove();
            };

            var instanceConfig = window.sizeDocContainer();
            instanceConfig.docId = docId;
            $.getJSON(window.docCloudApiPrefix + docId + ".json", window.populateDocumentMeta);
            this.documentInstance = new App.Views.DocumentInstance(instanceConfig);
            return this.applicationVisuals;
        },

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
    });


    App.Views.DocumentInstance = Backbone.View.extend({
        initialize: function(instanceConfig){
            console.log("DocumentInstance");
            instanceConfig.docDiv = "DV-viewer-" + instanceConfig.docId;
            instanceConfig.docUrl = "//www.documentcloud.org/documents/" + instanceConfig.docId + ".js";
            instanceConfig.docContainer = "#DV-viewer-" + instanceConfig.docId;
            this.render(instanceConfig);
        },
        render: function(instanceConfig){
            console.log(instanceConfig);
            $("#document-container").html("<div id=\"" + instanceConfig.docDiv + "\" class=\"DV-container\"></div>");
            window.loadDocumentInstance(instanceConfig);
        }
    });


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

            //window.app.navigate(this.instanceConfig.docId + "/#annotation/" + this.instanceConfig.annotation, {
                //trigger: true,
                //replace: false,
            //});
        },

        render: function(instanceConfig){
            $("#document-container").html("<div id=\"" + instanceConfig.docDiv + "\" class=\"DV-container\"></div>");
            window.loadDocumentInstance(instanceConfig);
        }
    });
