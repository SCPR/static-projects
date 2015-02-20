(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    window.template = function(url){
        var data = "<h1> failed to load url : " + url + "</h1>";
        $.ajax({
            async: false,
            dataType: "text",
            url: "/",
            success: function(response) {
                data = response;
            }
        });
        return data;
    };

    App.Models.Response = Backbone.Model.extend({
        defaults: {
            anecdote: "This is my anecdote"
        }
    });

    App.Models.Map = Backbone.Model.extend({});

    App.Models.Marker = Backbone.Model.extend({
        defaults: {
            id: 0,
            latitude: 47.601146851,
            longitude: -122.334979731,
        }
    });

    App.Collections.Responses = Backbone.Collection.extend({
        model: App.Models.Response,
        parse: function(response){
            return response.results;
        }
    });

    App.Collections.Markers = Backbone.Collection.extend({
        model:App.Models.Marker
    });

    App.Router = Backbone.Router.extend({

        routes: {
            "": "fetchData",
        },

        fetchData: function(){
            var rootUrl = "https://www.publicinsightnetwork.org/air2/api/public/search?a=6f4d503616e1115157a64bd26b51aec7&p=50&";
            var responsesCollection = new App.Collections.Responses();
            var newCollection = new App.Collections.Responses();
            var secondCollection = new App.Collections.Responses();
            var masterCollection = new App.Collections.Responses();

            var _this = this;

            $.when(
                responsesCollection.fetch({
                    url: rootUrl + "q=query_uuid:7345004f6c9f&t=JSON",
                    async: false
                }
            ), newCollection.fetch({
                    url: rootUrl + "q=query_uuid:5b095008373b&t=JSON",
                    async: false
                }
            ), secondCollection.fetch({
                    url: rootUrl + "q=query_uuid:298a682e1a77&t=JSON",
                    async: false
                }
            ))
            .done(function(){
                masterCollection.add(responsesCollection.models);
                masterCollection.add(newCollection.models);
                masterCollection.add(secondCollection.models);
                _this.createMap(masterCollection);
            });

        },

        createMap: function(collection){

            if (this.mapView){
                this.mapView.remove();
            };

            this.mapView = new App.Views.PinResponseMap({
                collection: collection,
                container: "content-map-canvas",
                initialZoom: 6
            });

            return this.mapView;
        },
    });

    App.Views.PinResponseMap = Backbone.View.extend({

        initialize: function(mapDataObject){

            this.stamenToner = new L.tileLayer(
                "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                    attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                    minZoom: 6,
                    maxZoom: 14
            });

            this.mapQuest = new L.tileLayer(
                "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
                    attribution: "Tiles, data, imagery and map information provided by <a href='http://www.mapquest.com' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'>, <a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a> and OpenStreetMap contributors.",
                    subdomains: ["otile1","otile2","otile3","otile4"]
            });

            this.osm = new L.TileLayer(
                "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    minZoom: 8,
                    maxZoom: 12,
                    attribution: "Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors"
                }
            );

            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.initialZoom = 7;
            } else {
                this.initialZoom = 9;
            }

            this.center = new L.LatLng(34.000304, -118.238039);

            this.render(mapDataObject);

        },


        /*
        events: {
            "click button#submit": "navigate",
            "click button#reset": "resetUserView",
            "keyup :input": "addressSearch",
            "click a.findMe": "findMe",
            "change #search-radius": "navigate",
            "click [type='checkbox']": "toggleLayers",
        },
        */

        /*
        addressSearch: function(e){
            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });

            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();

            if(e.keyCode != 13) {
                return false;
            } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
                return false;
            } else {
                this.navigate();
            }
        },
        */

        /*
        findMe: function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $("input[id='latitudeSearch']").val(position.coords.latitude);
                    $("input[id='longitudeSearch']").val(position.coords.longitude);
                    $("input[id='accuracySearch']").val(position.coords.accuracy);
                    $("button#submit").trigger("click");
                }, null);
            } else {
                alert("Sorry, we could not find your location.");
            }
        },
        */

        /*
        navigate: function(){
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var accuracy = $("input[id='accuracySearch']").val();
            var searchRadius = $("select[id='search-radius']").val();
            if (latitude === '' && longitude === ''){
                alert('Please enter an address or search by location')
            } else {
                if (this.map.hasLayer(this.userLayer)){
                    this.map.removeLayer(this.userLayer);
                    this.addUserLayerToMap(latitude, longitude, accuracy, searchRadius);
                } else {
                    this.addUserLayerToMap(latitude, longitude, accuracy, searchRadius);
                }
            }
        },
        */

        /*
        resetUserView: function(){
            if (this.map.hasLayer(this.userLayer)){
                this.map.removeLayer(this.userLayer);
            }
            $("select[id='search-radius']").val(
                $("select[id='search-radius']").prop('defaultSelected')
            );
            $("input[id='addressSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='longitudeSearch']").val('');
            $("input[id='accuracySearch']").val('');
            $("input[type='checkbox']").attr('checked', false);
            this.toggleLayers();
            this.map.setView(this.center, this.initialZoom);
            $("div.submit").html("<button type='button' id='submit'>Search</button>");
        },
        */

        /*
        addUserLayerToMap: function(latitude, longitude, accuracy, searchRadius){

            $("div.submit").html("<button type='button' id='reset'>Reset map</button>");

            // create our user layers
            this.userLocationCenter = new L.LatLng(latitude, longitude);
            this.userLocationMarker = L.userMarker([latitude, longitude], {
                pulsing: true,
                smallIcon: true,
                accuracy: accuracy
            });

            this.userRadius = L.circle([latitude, longitude], searchRadius, {
                clickable: false,
                opacity: 0.3,
                weight: 1,
                color: '#ec792b',
                fillColor: '#ec792b',
                fillOpacity: 0.3
            });

            // add our user layers
            this.userLayer = new L.layerGroup();
            this.userLayer.addLayer(this.userLocationMarker).addLayer(this.userRadius);
            this.userLayer.addTo(this.map);

            // pan map to user layer and sets to radius of user
            this.map.fitBounds(this.userRadius.getBounds());

        },
        */

        /*
        toggleLayers: function(event){

            if ($('#fault-lines').is(":checked")){
                this.map.addLayer(this.CaliforniaFaultLines);
                $("#fault-lines").attr("value", "shown");
            } else {
                this.map.removeLayer(this.CaliforniaFaultLines);
                $("#fault-lines").attr("value", "hidden");
            };

            if ($('#county-boundaries').is(":checked")){
                this.map.addLayer(this.CaliforniaCountyBoundaries);
                $("#county-boundaries").attr("value", "shown");
            } else {
                this.map.removeLayer(this.CaliforniaCountyBoundaries);
                $("#county-boundaries").attr("value", "hidden");
            };

        },
        */

        render: function(mapDataObject){
            this.map = L.map(mapDataObject.container, {
                scrollWheelZoom: false,
                zoomControl: true,
                minZoom: 6,
                maxZoom: 14
            }).setView(
                this.center, this.initialZoom
            ).addLayer(
                this.stamenToner
            );

            mapDataObject.map = this.map;

            this.markerViews = new App.Views.SingleMarkerView(mapDataObject);

        }
    });

    App.Views.SingleMarkerView = Backbone.View.extend({
        initialize: function(mapDataObject) {
            this.markerCollection = mapDataObject.collection.models;
            this.map = mapDataObject.map;

            if (this.markerCollection.length === undefined || this.markerCollection.length === null){
                console.log('undefined length');
            } else {
                this.addCollectionToMap(this.markerCollection);
            }
        },

        addCollectionToMap: function(arrayOfModels){

            console.log(arrayOfModels);

            for(var i=0; i<arrayOfModels.length; i++){

                this.marker = new L.CircleMarker([arrayOfModels[i].attributes.primary_lat, arrayOfModels[i].attributes.primary_long], {
                    radius: 5,
                    color: null,
                    fillColor: null,
                    fillOpacity: 1.0,
                    opacity: 1.0,
                    weight: 5.0,
                    clickable: true
                });

                if (arrayOfModels[i].attributes.query_uuid === "7345004f6c9f"){
                    this.marker.options.color = "blue";
                    this.marker.options.fillColor = "blue";
                } else if (arrayOfModels[i].attributes.query_uuid === "5b095008373b"){
                    this.marker.options.color = "green";
                    this.marker.options.fillColor = "green";
                } else {
                    this.marker.options.color = "yellow";
                    this.marker.options.fillColor = "yellow";
                }

                this.bindEvent(this.marker, arrayOfModels[i].attributes);
                this.map.addLayer(this.marker);
            };
        },

        bindEvent: function(marker, attributes){
            var featcherSentence = _.template(
                "<p><%= anecdote %></p>" +
                "<p><%= lastmod %></p>" +
                "<p><%= mtime %></p>" +
                "<p><%= primary_city %></p>" +
                "<p><%= primary_country %></p>" +
                "<p><%= primary_county %></p>" +
                "<p><%= primary_lat %></p>" +
                "<p><%= primary_long %></p>" +
                "<p><%= primary_state %></p>" +
                "<p><%= primary_zip %></p>" +
                "<p><%= query_title %></p>" +
                "<p><%= query_uuid %></p>" +
                "<p><%= score %></p>" +
                "<p><%= src_first_name %></p>" +
                "<p><%= src_last_name %></p>" +
                "<p><%= srs_date %></p>" +
                "<p><%= srs_ts %></p>" +
                "<p><%= srs_upd_dtim %></p>" +
                "<p><%= summary %></p>" +
                "<p><%= title %></p>", attributes);
            marker.bindPopup(featcherSentence);
        }
    });

    new App.Router;
    Backbone.history.start({
        root: "/",
        pushState: false,
    });
})();