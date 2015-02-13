App.Router = Backbone.Router.extend({
    initialize: function(){
        $(".kpcc-header").html(_.template(template("templates/kpcc-header.html")));
        $(".data-details").html(_.template(template("templates/data-details.html")));
        $(".kpcc-footer").html(_.template(template("templates/kpcc-footer.html")));
        window.testCollection = new App.Collections.zipCodeTabulationAreas(zipCodeRent.features);
    },

    routes: {
        "": "indexView",
    },

    indexView: function(){
        this.createMap(".data-visuals", "templates/data-visuals.html", 10);
    },

    createMap: function(container, template, initialZoom){

        // if mapView on page remove it
        if (this.mapView){
            this.mapView.remove();
        };

        this.mapView = new App.Views.MapView({
            data: window.testCollection,
            container: container,
            template: template,
            initialZoom: initialZoom
        });

        return this.mapView;
    }

});