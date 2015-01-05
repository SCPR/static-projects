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
        window.docCloudApiPrefix = "https://www.documentcloud.org/api/documents/";
        this.applicationWrapper = new App.Views.ApplicationWrapper();
        return this.applicationWrapper;
    },

    routes: {
        "": "renderDocumentList",
        //":docId/#annotation/:annotation(/)": "renderDocumentAnnotations",



        ":docId(/)": "renderDocumentInstance"



        //"/?doc=(/)": "renderDocumentInstance"
        //":docId/?=embed(/)": "renderDocumentInstance",
        // build in backwards compatibility...


    },

    renderDocumentList: function(){
        console.log("renderDocumentList - List all of the documents or handle this appropriately");
    },

    renderDocumentInstance: function(docId){
        if (this.documentInstance){
            this.documentInstance.remove();
        };
        var document = docId.split("=")
        var instanceConfig = window.sizeDocContainer();
        instanceConfig.docId = document[1];
        //$.getJSON(window.docCloudApiPrefix + docId + ".json", window.populateDocumentMeta);
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
        $("#document-container").html("<div id=\"" + instanceConfig.docDiv + "\" class=\"DV-container\"></div>");
        window.loadDocumentInstance(instanceConfig);
    }
});


window.loadDocumentInstance = function(instanceConfig){

    console.log(instanceConfig);


    /*
    var documentInstance = DV.load(instanceConfig.docUrl, {
        width: instanceConfig.initialWidthParam,
        height: instanceConfig.docHeightParam,
        sidebar: instanceConfig.sidebarParam,
        text: true,
        pdf: true,
        responsive: true,
        container: instanceConfig.docContainer
    });
    return documentInstance;
    */

};