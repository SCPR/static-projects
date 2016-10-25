    window.splitTitle = function(title){
        var split_title = title.split("Email");
        parsed_date = moment(split_title[0]).format('MMMM D, YYYY');
        split_title[0] = parsed_date;
        return split_title[0] + " email " + split_title[1];
    };

    App.Models.Document = Backbone.Model.extend({
        defaults: {
            id: null,
            title: null
        }
    });

    App.Collections.Documents = Backbone.Collection.extend({
        model: App.Models.Document,
        url: "data/documents.json",
        comparator: function(model) {
            return model.get("title");
        }
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            window.documentsCollection = new App.Collections.Documents();
            window.documentsCollection.fetch({
                async: false,
            });
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "indexView",
            ":docId/": "documentView",
        },

        indexView: function(){
            window.app.navigate("3131720-Oppose-Proposition-56" + "/", {
                trigger: true,
                replace: false,
            });
        },

        documentView: function(docId){
            this.renderApplicationVisuals(".data-visuals", docId);
        },

        renderApplicationVisuals: function(container, doc_id){
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                document_id: doc_id,
                container: container
            });
            return this.applicationVisuals;
        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        template: _.template(template("templates/document-select.html")),

        el: ".data-visuals",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        events: {
            "change #create-document-instance": "evaluateSelectedDocument",
            // "click #note-navigation-links li a": "popNoteDisplay"
        },

        evaluateSelectedDocument: function(e){
            e.preventDefault();
            $("#document-meta-data").empty();
            var docId = $("#create-document-instance").val();
            var docDiv = "DV-viewer-" + docId;
            var docUrl = "//www.documentcloud.org/documents/" + docId + ".js";
            var docContainer = "#DV-viewer-" + docId;
            $("#document-container").html("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
            window.app.navigate("#" + docId + "/", {
                trigger: true,
                replace: false,
            });
        },

        getDocumentNotes: function(docId){
            var apiPrefix = "https://www.documentcloud.org/api/documents/";
            $.getJSON(apiPrefix + docId + ".json", this.populateDocumentNotes);
        },

        populateDocumentNotes: function(data){
            var documentDescription;
            var documentSource;
            if (data.document.description){
                documentDescription = "<p><em><strong>About this</strong></em>: " + data.document.description + "</p>";
            } else {
                documentDescription = ""
            };
            if (data.document.description){
                documentSource = "<p><em><strong>Source</strong></em>: " + data.document.source + "</p>";
            } else {
                documentSource = ""
            };
            var title = data.document.title;
            $('#document-meta-data').html(
                "<h6>" + data.document.title + "</h6>" +
                documentDescription + "" +
                documentSource
            );
            // for(var i=0; i<data.document.annotations.length; i++){
            //     $("ul#note-navigation-links").append(
            //         "<li><a href='#" + data.document.id + "#document/p" + data.document.annotations[i].page + "/a" +
            //         data.document.annotations[i].id + "'>" + data.document.annotations[i].title + "</a></li>"
            //     );
            // };
        },

        // popNoteDisplay: function(e){
        //     console.log("clicked");
        // },

        render: function(viewObject){
            $(viewObject.container).html(this.template({
                collection: window.documentsCollection.toJSON()
            }));
            $("#create-document-instance").val(viewObject.document_id);
            var docDiv = "DV-viewer-" + viewObject.document_id;
            var docUrl = "//www.documentcloud.org/documents/" + viewObject.document_id + ".js";
            var docContainer = "#DV-viewer-" + viewObject.document_id;
            $(".progress-list").removeClass("hidden");
            var sidebarParam;
            var docHeightParam;
            if (navigator.userAgent.match(/(iPad)/i)) {
                sidebarParam = false;
                docHeightParam = 720;
            } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
                sidebarParam = false;
                docHeightParam = 440;
            } else {
                sidebarParam = false;
                docHeightParam = 1020;
            };
            var initialWidth = $("#document-container").width() + 20;
            $("#document-container").append("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");
            DV.load(docUrl, {
                width: initialWidth,
                height: docHeightParam,
                sidebar: sidebarParam,
                text: false,
                pdf: false,
                container: docContainer
            });
            var docId = docDiv.replace("DV-viewer-", "");
            this.getDocumentNotes(docId);
            $(".progress-list").addClass("hidden");

        }
    });
