    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },
        routes: {
            "": "renderApplicationVisuals",
        },
        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        },
    });

    App.Views.ApplicationVisuals = Backbone.View.extend({
        template: template("templates/data-visuals.html"),
        el: ".data-visuals",
        initialize: function(viewObject){
            this.render(viewObject);
        },
        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            dc.embed.load('http://www.documentcloud.org/search/embed/', {
                q: "projectid: 7784-la_clergy_files ",
                container: "#DC-search-projectid-7784-la_clergy_files",
                order: "title",
                per_page: 6,
                search_bar: true,
                organization: 97
            });
        },
    });