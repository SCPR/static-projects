App.Router = Backbone.Router.extend({
    initialize: function(){
        // render base templates
        $(".kpcc-header").html(_.template(template("templates/kpcc-header.html")));
        $(".data-details").html(_.template(template("templates/data-details.html")));
        $(".kpcc-footer").html(_.template(template("templates/kpcc-footer.html")));

        window.municipalitiesCollection = new App.Collections.Municipalities();
        window.municipalitiesCollection.fetch({
            async: false,
        });

        window.restrictionsCollection = new App.Collections.WaterRestrictions();
        window.restrictionsCollection.fetch({
            async: false,
        });
    },

    routes: {
        "": "indexView",
    },

    indexView: function(){
        this.createVisuals(".data-visuals", "templates/data-visuals.html");
    },

    createVisuals: function(container, template){
        if (this.visualsView){
            this.visualsView.remove();
        };

        this.visualsView = new App.Views.VisualsView({
            container: container,
            template: template,
        });

        return this.visualsView;
    }
});