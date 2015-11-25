    // App.Models.FloodZone = Backbone.Model.extend({
    //     defaults: {
    //         properties: null,
    //     },
    // });

    // App.Collections.FloodZones = Backbone.Collection.extend({
    //     model: App.Models.FloodZone,
    //     url: "data/flood_zone_100.json",
    // });

    App.Router = Backbone.Router.extend({

        initialize: function(){

            L.TopoJSON = L.GeoJSON.extend({
                addData: function(jsonData){
                    if (jsonData.type === "Topology"){
                        for (key in jsonData.objects){
                            geojson = topojson.feature(jsonData, jsonData.objects[key]);
                            L.GeoJSON.prototype.addData.call(this, geojson);
                        }
                    } else {
                        L.GeoJSON.prototype.addData.call(this, jsonData);
                    }
                }
            });

            this.applicationWrapper = new App.Views.ApplicationWrapper();
            return this.applicationWrapper;
        },

        routes: {
            "": "fetchData",
        },

        fetchData: function(){

            // var _this = this;
            // var application_collection = new App.Collections.FloodZones();
            // application_collection.fetch({
            //     async: false
            // });

            // $.getJSON("data/flood_zone_100_500.json", this.render_application_visuals);

            $.getJSON("data/flood_zone_100.json", this.render_application_visuals);

            // var checkExist = setInterval(function() {
            //     if (application_collection.length > 0){
            //         clearInterval(checkExist);
            //         _this.render_application_visuals(application_collection);
            //     }
            // }, 500);

        },

        render_application_visuals: function(data){
            if (this.application_visuals){
                this.application_visuals.remove();
            };
            this.application_visuals = new App.Views.ApplicationVisuals({
                geo_data: data,
            });
            return this.application_visuals;
        },

    });

    App.Views.ApplicationVisuals = Backbone.View.extend({

        tagName: "div",

        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",

        template: template("templates/data-visuals.html"),

        el: ".data-visuals",

        initialize: function(object){
            this.view_object = object;
            this.view_object.stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
                attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                subdomains: "abcd",
                minZoom: 0,
                maxZoom: 8
            });

            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.view_object.initialZoom = 8;
            } else {
                this.view_object.initialZoom = 8;
            }
            this.view_object.center = new L.LatLng(34.061841979429445, -118.26370239257812);
            this.render();
        },

        events: {
            "click a.findMe": "findMe",
            "click a.searchMe": "searchMe",
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
            "click button#reset": "resetUserView"
        },

        findMe: function(){
            $("#form-controls").addClass("hidden");
            $(".findMe").css("font-weight", "700");
            $("img.findMe").css("opacity", "1.0");
            $(".searchMe").css("font-weight", "100");
            $("img.searchMe").css("opacity", "0.3");
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

        searchMe: function(){
            $("#form-controls").removeClass("hidden");
            $(".searchMe").css("font-weight", "700");
            $("img.searchMe").css("opacity", "1.0");
            $(".findMe").css("font-weight", "100");
            $("img.findMe").css("opacity", "0.3");
            $("input[id='addressSearch']").val("");
            $("input[id='latitudeSearch']").val("");
            $("input[id='longitudeSearch']").val("");
        },

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

        navigate: function(){
            $("#reset").removeClass("hidden");
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var accuracy = $("input[id='accuracySearch']").val();
            if (latitude === '' && longitude === ''){
                alert('Please enter an address or search by location')
            } else {
                if (this.view_object.map.hasLayer(this.userLayer)){
                    this.view_object.map.removeLayer(this.userLayer);
                    this.addUserLayerToMap(latitude, longitude, accuracy);
                } else {
                    this.addUserLayerToMap(latitude, longitude, accuracy);
                }
            }
        },

        findFeatureForLatLng: function(latitude, longitude){

            var user_is_at = {
                lng: longitude,
                lat: latitude
            };

            console.log(user_is_at);

            this.ww = Wherewolf();

            this.ww.addAll(this.view_object.geo_data);

            var districts = this.ww.find(user_is_at);

            if (districts._100_only === null){
                alert("You might be safe");
            } else {
                alert("RUN FOR THE HILLS!!! FLOOD ZONE!!!");
            };

        },

        resetUserView: function(){
            $("#reset").addClass("hidden");
            $("#form-controls").addClass("hidden");
            $(".searchMe").css("font-weight", "700");
            $("img.searchMe").css("opacity", "1.0");
            $(".findMe").css("font-weight", "700");
            $("img.findMe").css("opacity", "1.0");
            if (this.view_object.map.hasLayer(this.userLayer)){
                this.view_object.map.removeLayer(this.userLayer);
            }
            $("input[id='addressSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='longitudeSearch']").val('');
            $("input[id='accuracySearch']").val('');
            this.view_object.map.setView(this.view_object.center, this.view_object.initialZoom);
        },

        addUserLayerToMap: function(latitude, longitude, accuracy){
            this.userLocationCenter = new L.LatLng(latitude, longitude);
            this.userLocationMarker = L.userMarker([latitude, longitude], {
                pulsing: true,
                smallIcon: true,
                accuracy: accuracy
            });
            this.userRadius = L.circle([latitude, longitude], 20, {
                clickable: false,
                opacity: 0.3,
                weight: 1,
                color: '#ec792b',
                fillColor: '#ec792b',
                fillOpacity: 0.3
            });
            this.userLayer = new L.layerGroup();
            this.userLayer.addLayer(this.userLocationMarker);
            this.userLayer.addTo(this.view_object.map);
            this.view_object.map.fitBounds(this.userRadius.getBounds());
            this.findFeatureForLatLng(parseFloat(latitude), parseFloat(longitude));
        },

        onMapClick: function(e){

            console.log(e.latlng.lat, e.latlng.lng);

            /*
            var popup = L.popup();
            popup
                .setLatLng(e.latlng)
                .setContent("</div>You clicked the map at " + e.latlng.toString())
                .openOn(this.view_object.map);
            */

            //$("#theform").show();

            //$("input[id='pin-q-15f9abb472d4']").val(e.latlng.lat);
            //$("input[id='pin-q-7defd64f7f1f']").val(e.latlng.lng);

            //formopen = true;

            //$("#form-name").focus();

        },

        render: function(){
            $(this.el).html(this.template);
            this.view_object.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: true,
                minZoom: 6,
                maxZoom: 16
            });
            this.view_object.map.setView(this.view_object.center, this.view_object.initialZoom);
            this.view_object.map.addLayer(this.view_object.stamenToner);
            this.view_object.map.on('click', this.onMapClick);

            this.CaliforniaCountyBoundaries = new L.TileLayer('http://archives.chrislkeller.com/map-tiles/california-county-boundaries/{z}/{x}/{y}.png');

            // var my_test = new L.TileLayer("test_tiles/{z}/{x}/{y}.png");

            this.view_object.map.addLayer(this.CaliforniaCountyBoundaries);

            // this.set_topo_layer();
        },

        set_topo_layer: function(){
            this.topoLayer = new L.TopoJSON();
            this.topoLayer.addData(this.view_object.geo_data);
            // this.topoLayer.addTo(this.view_object.map);
            // this.topoLayer.eachLayer(this.style);
        },

        style: function (layer){
            layer.setStyle({
                fillColor: "#f07a30",
                fillOpacity: .8,
                color: '#000000',
                weight: .8,
                opacity: .8
            });
        },
    });
