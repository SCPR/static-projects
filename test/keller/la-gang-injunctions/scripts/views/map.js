App.Views.MapView = Backbone.View.extend({

    tagName: "div",

    className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

    initialize: function(viewConfig){
        console.log('map view rendered');
        this.template = _.template(template(viewConfig.template)),
        this.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
            attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
        	subdomains: "abcd",
        	minZoom: 6,
        	maxZoom: 12
        });

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            this.initialZoom = 6;
        } else {
            this.initialZoom = viewConfig.initialZoom;
        }


        console.log(gangData);

        this.gangData = L.geoJson(gangData, {
            style: function (feature) {
                return {
                    color: 'green',
                    weight: 2,
                    opacity: 1,
                    fillColor: 'green',
                    fillOpacity: 1
                }
            }
        });



        this.center = new L.LatLng(34.061841979429445, -118.26370239257812);
        this.render(viewConfig);
    },

    render: function(viewConfig){
        $(viewConfig.container).html(this.$el.html(this.template()));
        this.map = L.map("content-map-canvas", {
            scrollWheelZoom: false,
            zoomControl: true,
            minZoom: 6,
        	maxZoom: 12
        }).setView(
            this.center, this.initialZoom
        ).addLayer(
            this.stamenToner
        ).addLayer(this.gangData);

        //this.model = markersCollection.model.attributes;
        //this.model.map = this.map;
        //this.markerViews = new App.Views.ClusteredMarkerView(this.model);
    }

});