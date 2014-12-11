    window.splitTitle = function(title){
        var split_title = title.split("Email");
        parsed_date = moment(split_title[0]).format('MMMM D, YYYY');
        split_title[0] = parsed_date;
        return split_title[0] + " email " + split_title[1];
    };

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "indexView",
        },

        indexView: function(){
            this.renderApplicationVisuals();
        },

        renderApplicationVisuals: function(){
            var docId = $.url.param("doc").replace("/", "");
            var docDiv = "DV-viewer-" + docId;
            var docUrl = "//www.documentcloud.org/documents/" + docId + ".js";
            var docContainer = "#DV-viewer-" + docId;
            $("#document-container").html("<div id=\"" + docDiv + "\" class=\"DV-container\"></div>");

            var sidebarParam;
            var docHeightParam;

            // set params for mobile devices
            if (navigator.userAgent.match(/(iPad)/i)) {
                sidebarParam = false;
                docHeightParam = 720;
            } else if (navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i)) {
                sidebarParam = false;
                docHeightParam = 440;
            } else {
                sidebarParam = false;
                docHeightParam = 920;
            };

            var initialWidth = $("#document-container").width();

            DV.load(docUrl, {
                width: initialWidth,
                height: docHeightParam,
                sidebar: sidebarParam,
                text: true,
                pdf: true,
                container: docContainer
            });

            var apiPrefix = "https://www.documentcloud.org/api/documents/";
            $.getJSON(apiPrefix + docId + ".json", this.populateDocumentMeta);

        },

        populateDocumentMeta: function(data){
            window.appConfig.twitter_share_text = "View a document: " + data.document.title;
            $("#maintitle").text(data.document.title);
            $("meta[property='og:title']").attr("content", data.document.title);
            $("meta[name='twitter:title']").attr("content", data.document.title);
            $("meta[name=description]").attr("content", data.document.description);
            $("meta[property='og:description']").attr("content", data.document.description);
            $("meta[name='twitter:description']").attr("content", data.document.description);
            $("meta[property='og:url']").attr("content", data.document.resources.published_url);
            $("meta[name='twitter:url']").attr("content", data.document.resources.published_url);
            $(".headlines").append(
                "<h4 class='kicker'>Documents</h4>" +
                "<h3>" + data.document.title + "</h3>"
            );
            $(".doc-description").html("<p>" + data.document.description + "</p>");
            $(".credits").html("Produced by " + data.document.contributor);
            $(".pubdate").html("Updated " + moment(data.document.updated_at).format("MMM D, YYYY"));
            $(".source").html(data.document.source);
            $(".control-buttons").append(
                "<a class='btn btn-primary read-more' href='" + data.document.resources.related_article + "' target='_blank'><span class='glyphicon glyphicon-link'></span> Read more</a>"
            );
        }
    });
