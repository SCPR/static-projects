    App.Models.SafetyZone = Backbone.Model.extend({
        defaults: {
            gang_name: null,
            url_to_injunction: null,
            document_cloud_url: null,
            case_filed: null,
            date_of_injunction: null,
            year_of_injunction: null,
            trial_date: null,
            judges_name: null,
            case_number: null,
            number_originally_targeted: null,
            notes: null,
        },
    });

    App.Collections.SafetyZones = Backbone.Collection.extend({
        model: App.Models.SafetyZone,
        url: "data/data.json",
    });

    App.Router = Backbone.Router.extend({
        initialize: function(){
            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var _this = this;
            var applicationCollection = new App.Collections.SafetyZones();
            applicationCollection.fetch({
                async: true
            });
            var checkExist = setInterval(function() {
                if (applicationCollection.length > 0){
                    clearInterval(checkExist);
                    _this.renderApplicationVisuals(applicationCollection);
                }
            }, 500);
        },

        renderApplicationVisuals: function(collection){
            if (this.applicationVisuals){
                this.applicationVisuals.remove();
            };
            this.applicationVisuals = new App.Views.ApplicationVisuals({
                collection: collection,
                container: ".data-visuals"
            });
            return this.applicationVisuals;
        }

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(viewObject){
            this.render(viewObject);
        },

        events: {
            //"click a#animation-backward": "moveIncrementBackward",
        },

        styleFeatures: function (feature){
            return {
                color: "black",
                weight: 0.8,
                opacity: 0.8,
                fillOpacity: 0.8,
                fillColor: "green"
            }
        },

        onEachFeature: function(feature, layer){
            var featcherDetails = (
                "<h6><%= ZONE_NAME %></h6>" +
                "<p><strong>Targeted gang</strong>: <%= NAME %></p>" +
                "<p><strong>Implemented in</strong>: <%= year_of_i %></p>" +
                "<p><strong>Individuals targeted</strong>: <%= number_or %></p>" +
                "<p><strong>Case number</strong>: <%= case_numb %></p>" +
                "<p><strong>Case filed</strong>: <%= case_file %></p>" +
                "<p><strong>Injunction approved</strong>: <%= date_of_i %></p>" +
                "<p><strong>Issued by judge</strong>: <%= judges_na %></p>" +
                "<p>: <%= document_ %></p>"
            );
            layer.on("click", function(e){
                var data = e.target.feature.properties;
                $(".content-feature-data").html(_.template(featcherDetails, data));
            });
        },

        render: function(viewObject){
            $(viewObject.container).html(_.template(this.template));
            this.stamenToner = new L.tileLayer(
                "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                    attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                    minZoom: 6,
                    maxZoom: 14
            });

            this.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: false,
                minZoom: 6,
                maxZoom: 14
            }).setView(
                window.appConfig.map_center_los_angeles, window.appConfig.initial_map_zoom
            ).addLayer(
                this.stamenToner
            ).addControl(L.control.zoom({
                position: "topright"
            }));

            this.geojsonLayer = L.geoJson(viewObject.collection, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });


            this.geojsonLayer.addTo(this.map);


        }

    });
