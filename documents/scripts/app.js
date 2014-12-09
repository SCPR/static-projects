    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(){

            var docId = $.url.param("doc");
            console.log(docId);

            var docDiv = "DV-viewer-" + docId;
            console.log(docDiv);

            $("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");


        },

    });