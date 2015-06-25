    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "renderApplicationVisuals",
        },

        renderApplicationVisuals: function(){
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

            this.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                subdomains: "abcd",
                minZoom: 6,
                maxZoom: 16
            });

            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.initialZoom = 6;
            } else {
                this.initialZoom = 8;
            }

            this.center = new L.LatLng(34.061841979429445, -118.26370239257812);

            this.render(viewObject);
        },


        events: {
            "click a.search": "getSearchTerm",
        },


        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));

            this.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: true,
                minZoom: 6,
                maxZoom: 16
            }).setView(this.center, this.initialZoom).addLayer(this.stamenToner)

            this.addMarkers(airport_data);

        },

        addMarkers: function(airport_data){

            for(var i=0; i<airport_data.length; i++){

                this.marker = new L.CircleMarker([airport_data[i].latitude, airport_data[i].longitude], {
                    radius: 8,
                    color: "green",
                    fillColor: "green",
                    fillOpacity: 1.0,
                    opacity: 1.0,
                    weight: 5.0,
                    clickable: false
                });

                this.map.addLayer(this.marker);

            };
        },


        getSearchTerm: function(e){

            console.log("clicked");

        }

    });