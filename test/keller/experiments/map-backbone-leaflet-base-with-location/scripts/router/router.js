App.Router = Backbone.Router.extend({
    initialize: function(){
        // render base templates
        $(".kpcc-header").html(_.template(template("templates/kpcc-header.html")));
        $(".data-details").html(_.template(template("templates/data-details.html")));
        $(".kpcc-footer").html(_.template(template("templates/kpcc-footer.html")));
    },

    routes: {
        "": "indexView",
    },

    indexView: function(){
        this.createMap(".data-visuals", "templates/data-visuals.html", 10);
    },

    //createMap: function(mapContainer, markers, template, initialZoom){
    createMap: function(container, template, initialZoom){

        // if mapView on page remove it
        if (this.mapView){
            this.mapView.remove();
        };

        //this.mapModel = new App.Models.Map({
            //markers: markers
        //});

        this.mapView = new App.Views.MapView({
            //model: this.mapModel,
            container: container,
            template: template,
            initialZoom: initialZoom
        });

        return this.mapView;
    }

});