    App.Router = Backbone.Router.extend({
        initialize: function(){
            $.fn.jAlert.defaults.backgroundColor = "white";
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
            "": "fetchData"
        },

        fetchData: function(){
            $(".data-visuals").html(template("templates/data-loading.html"));
            var array_of_flood_facts = [
                "In the past five years, all 50 states have experienced flooding.",
                "Flood insurance claims average more than $3 billion per year.",
                "Flood insurance doesn't cover damage from landslides and other \"earth movements.\" Damage from mudflows – defined as rivers of liquid and flowing mud on the surface of normally dry land – would usually be covered.",
                "A \"100-year flood\" doesn't necessarily happen once every century. It has a one percent chance of happening in any given year, even if there was a flood last year.",
                "Areas that have recently experienced wildfires are especially at risk of flooding and mudflows for up to five years after.",
                "Not sure what to put in your emergency kit? Start with a three-day supply of food and water, a flashlight and a battery-powered or handcrank radio.",
            ];

            $(".rando-fact").text(array_of_flood_facts[3]);

            setInterval(function(){
                var idx = Math.floor(array_of_flood_facts.length * Math.random());
                $(".rando-fact").text(array_of_flood_facts[idx]);
            }, 3700);
<<<<<<< HEAD
            // $.getJSON("data/flood_zone_100.json", this.render_application_visuals);
            // $.getJSON("data/flood_zone_100_500.json", this.render_application_visuals);
            $.getJSON("data/100.json", this.render_application_visuals);
=======
            $.getJSON("data/flood_zone_100.json", this.render_application_visuals);
            //$.getJSON("data/flood_zone_100_500.json", this.render_application_visuals);
>>>>>>> origin/master
        },

        render_application_visuals: function(data){
            if (this.application_visuals){
                this.application_visuals.remove();
            };
            this.application_visuals = new App.Views.ApplicationVisuals({
                geo_data: data
            });
            return this.application_visuals;
        }
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
                minZoom: 6,
                maxZoom: 15
            });
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.view_object.initialZoom = 8;
            } else {
                this.view_object.initialZoom = 8;
            }
            this.view_object.center = new L.LatLng(34.061841979429445, -118.26370239257812);
            this.view_object.wherewolf = Wherewolf();
            this.view_object.wherewolf.addAll(this.view_object.geo_data);
            this.view_object.cali_wherewolf = Wherewolf();
            this.render();
        },

        events: {
            "click a.searchMe": "searchMe",
            "click a.findMe": "findMe",
            "focusin #addressSearch": "addressSearch",
            "keyup #addressSearch" : "enterKeyPressedEventHandler",
            "click button#submit": "navigate",
            "click button#reset": "resetUserView",
        },

        render: function(){
            $(this.el).html(this.template);
            this.view_object.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                zoomControl: true,
                minZoom: 6,
                maxZoom: 15
            });
            this.view_object.map.setView(this.view_object.center, this.view_object.initialZoom);
            this.view_object.map.addLayer(this.view_object.stamenToner);
            // this.view_object.map.on("click", this.onMapClick);
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

        findMe: function(){
            var locationOptions = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 10000
            };
            $("#form-controls").addClass("hidden");
            $(".findMe").css("font-weight", "700");
            $("img.findMe").css("opacity", "1.0");
            $(".searchMe").css("font-weight", "100");
            $("img.searchMe").css("opacity", "0.3");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, locationOptions);
            } else {
                warningAlert("Sorry", "Your browser lacks geolocation capabilities.");
            };
        },

        locationSuccess: function(position){
            $("input[id='latitudeSearch']").val(position.coords.latitude);
            $("input[id='longitudeSearch']").val(position.coords.longitude);
            $("button#submit").trigger("click");
        },

        locationError: function(error){
            if (error.code === 1){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Sorry. " + error.message + "</strong>",
                    "content": "The user denied use of location services or your privacy settings do not allow this application to determine your current location."
                  });
            } else if (error.code === 2){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Sorry. " + error.message + "</strong>",
                    "content": "We could not find your location."
                  });
            } else if (error.code === 3){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Sorry. " + error.message + "</strong>",
                    "content": "An attempt to locate your position timed out. Please refresh the page and try again."
                  });
            };
        },

        addressSearch: function(event){
            event.preventDefault();
            $("input[id='addressSearch']").geocomplete({
                details: "form"
            });
        },

        enterKeyPressedEventHandler: function(event){
            if(event.keyCode === 13){
                this.navigate();
            };
        },

        navigate: function(){
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            if (latitude === "" && longitude === ""){
                warningAlert("Sorry", "Please enter an address or search by location");
            } else {
                this.view_object.userLayerPresent = this.view_object.map.hasLayer(this.userLayer);
                if (this.view_object.userLayerPresent === false){
                    this.addUserLayerToMap(latitude, longitude);
                    this.raiseFloodZoneAlert(latitude, longitude);
                } else {
                    this.view_object.map.removeLayer(this.userLayer);
                    this.addUserLayerToMap(latitude, longitude);
                    this.raiseFloodZoneAlert(latitude, longitude);
                }
            };
        },

        // refactor this function because it is too busy
        resetUserView: function(){
            $("#reset").addClass("hidden");
            $("#form-controls").addClass("hidden");
            $(".searchMe").css("font-weight", "700");
            $("img.searchMe").css("opacity", "1.0");
            $(".findMe").css("font-weight", "700");
            $("img.findMe").css("opacity", "1.0");
            if (this.view_object.map.hasLayer(this.userLayer)){
                this.view_object.map.removeLayer(this.userLayer);
            };
            if (this.view_object.map.hasLayer(this.topoLayer)){
                this.view_object.map.removeLayer(this.topoLayer);
            }
            $("input[id='addressSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='longitudeSearch']").val('');
            this.view_object.map.setView(this.view_object.center, this.view_object.initialZoom);
        },
        // refactor this function because it is too busy

        addUserLayerToMap: function(latitude, longitude){
            this.userLocationCenter = new L.LatLng(latitude, longitude);
            this.userLocationMarker = L.userMarker([latitude, longitude], {
                pulsing: true,
                smallIcon: true
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
        },

        raiseFloodZoneAlert: function(latitude, longitude){
            this.view_object.layer = this.findFeatureForLatLng(parseFloat(latitude), parseFloat(longitude));
            if (this.view_object.layer === false){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Sorry</strong>",
                    "content": "We're only equipped to find flood zones in California."
                  });
                $("button#reset").trigger("click");
            } else {
                $("#reset").removeClass("hidden");
                if (this.view_object.layer.zones._flood_zones === null){
                    $.jAlert({
                        "replaceOtherAlerts": true,
                        "closeOnClick": true,
                        "theme": "green",
                        "title": "<strong>You're not in a flood zone</strong>",
                        "content": "But that doesn't mean that your area can't flood. FEMA estimates that a third of Federal Disaster Assistance goes to people outside of high-risk flood zones. <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>Here's how FEMA recommends you stay safe in a flood</a>."
                      });
                } else if (this.view_object.layer.zones._flood_zones === undefined){
                    $.jAlert({
                        "replaceOtherAlerts": true,
                        "closeOnClick": true,
                        "theme": "yellow",
                        "title": "<strong>Sorry</strong>",
                        "content": "We were unable to complete your search."
                      });
                } else {
                    $.jAlert({
                        "replaceOtherAlerts": true,
                        "closeOnClick": true,
                        "theme": "red",
                        "title": "<strong>You're in a flood zone</strong>",
                        "content": "Flood insurance is typically required for homeowners in these areas, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>."
                      });
                    this.set_topo_layer(this.view_object.layer.zones._flood_zones)
                };
            };
        },

        findFeatureForLatLng: function(latitude, longitude){
            var user_here = {
                lng: longitude,
                lat: latitude
            };
            var _this = this;
            var proceed = null;
            $.ajax({
                async: false,
                url: "data/ca_counties.json",
                dataType: "json",
                success: function(data){
                    _this.view_object.cali_wherewolf.addAll(data);
                    var in_cali = _this.view_object.cali_wherewolf.find(user_here, {wholeFeature: true});
                    if (in_cali.counties === null || in_cali.counties === undefined){
                        proceed = false;
                    } else {
                        proceed = true;
                    };
                }
            });
            if (proceed === true){
                var zones = _this.view_object.wherewolf.find(user_here, {wholeFeature: true});
                return {"zones": zones, "user_here": user_here};
            } else {
                return false;
            };
        },

        // onMapClick: function(e){
        //     console.log(e.latlng.lat, e.latlng.lng);
        //     var popup = L.popup();
        //     popup
        //         .setLatLng(e.latlng)
        //         .setContent("</div>You clicked the map at " + e.latlng.toString())
        //         .openOn(this.view_object.map);
        //     $("#theform").show();
        //     $("input[id='pin-q-15f9abb472d4']").val(e.latlng.lat);
        //     $("input[id='pin-q-7defd64f7f1f']").val(e.latlng.lng);
        //     $("#form-name").focus();
        // },

        set_topo_layer: function(geo_data){
            this.topoLayer = new L.TopoJSON();
            this.topoLayer.addData(geo_data);
            this.topoLayer.eachLayer(this.style);
            this.topoLayer.addTo(this.view_object.map);
        },

        style: function (layer){
            layer.setStyle({
                fillColor: "#f07a30",
                fillOpacity: .85,
                color: '#000000',
                weight: .85,
                opacity: .85
            });
        }
    });
