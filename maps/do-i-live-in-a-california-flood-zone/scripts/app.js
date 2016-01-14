    App.Router = Backbone.Router.extend({
        initialize: function(){
            $.fn.jAlert.defaults.backgroundColor = "white";
            window.config = {};
            window.config.lat = 34.061841979429445
            window.config.lng = -118.26370239257812
            window.config.zoom = 8
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
            "display/lat=:latitude&lng=:longitude&zoom=:zoomLevel(/)": "renderCustomView"
        },

        renderCustomView: function(lat, lng, zoom){
            var lat = parseFloat(lat);
            var lng = parseFloat(lng);
            var zoom = parseInt(zoom);

            if (zoom <= 1 || zoom >= 16){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Invalid zoom level</strong>",
                    "content": "Zoom level should be between 1 and 15. Please try again."
                  });

            } else if (lat > 90 || lat < -90 && lng > 180 || lng < -180){
                $.jAlert({
                    "replaceOtherAlerts": true,
                    "closeOnClick": true,
                    "theme": "yellow",
                    "title": "<strong>Invalid coordinates</strong>",
                    "content": "Latitude coordinates should be between -90 and 90, and longitude coordinates should be between -180 and 180. Please try again."
                  });
            } else {
                window.config.lat = lat;
                window.config.lng = lng;
                window.config.zoom = zoom;
                this.fetchData();
            };
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

            $.getJSON("data/100.json", function(data){
                window.config._100_year_flood = data;
            });

            $.getJSON("data/500.json", function(data){
                window.config._500_year_flood = data;
            });

            var _this = this;
            var checkExist = setInterval(function() {
                var _100 = _.has(window.config, "_100_year_flood");
                var _500 = _.has(window.config, "_500_year_flood");
                if (_100 === true && _500 === true){
                    clearInterval(checkExist);
                    _this.render_application_visuals(window.config);
                }
            }, 500);

        },

        render_application_visuals: function(config){
            if (this.application_visuals){
                this.application_visuals.remove();
            };
            this.application_visuals = new App.Views.ApplicationVisuals(config);
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
                minZoom: 1,
                maxZoom: 15
            });
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.view_object.zoom = 8;
            } else {
                this.view_object.zoom = this.view_object.zoom;
            };
            this.view_object.center = new L.LatLng(this.view_object.lat, this.view_object.lng);
            this.view_object._100_wherewolf = Wherewolf();
            this.view_object._500_wherewolf = Wherewolf();
            this.view_object.cali_wherewolf = Wherewolf();
            this.view_object._100_wherewolf.addAll(this.view_object._100_year_flood);
            this.view_object._500_wherewolf.addAll(this.view_object._500_year_flood);
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
            this.view_object.map.setView(this.view_object.center, this.view_object.zoom);
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
            this.view_object.map.setView(this.view_object.center, this.view_object.zoom);
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
            var _100_null = _.isNull(this.view_object.layer._100_zones._flood_zones);
            var _100_undefined = _.isUndefined(this.view_object.layer._100_zones._flood_zones);
            var _100_value = _.isObject(this.view_object.layer._100_zones._flood_zones)
            var _500_null = _.isNull(this.view_object.layer._500_zones._flood_zones);
            var _500_undefined = _.isUndefined(this.view_object.layer._500_zones._flood_zones);
            var _500_value = _.isObject(this.view_object.layer._500_zones._flood_zones)

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
                if (_100_null === true && _500_null === true){
                    $.jAlert({
                        "replaceOtherAlerts": true,
                        "closeOnClick": true,
                        "theme": "green",
                        "title": "<strong>You're not in a flood zone</strong>",
                        "content": "But that doesn't mean that your area can't flood. FEMA estimates that a third of Federal Disaster Assistance goes to people outside of high-risk flood zones. <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>Here's how FEMA recommends you stay safe in a flood</a>."
                      });
                } else if (_100_undefined === true && _500_undefined === true){
                    $.jAlert({
                        "replaceOtherAlerts": true,
                        "closeOnClick": true,
                        "theme": "yellow",
                        "title": "<strong>Sorry</strong>",
                        "content": "We were unable to complete your search."
                      });
                } else {
                    if (_100_value === true && _500_value === true){
                        $.jAlert({
                            "replaceOtherAlerts": true,
                            "closeOnClick": true,
                            "theme": "black",
                            "title": "<strong>You're in a 100-year and 500-year flood zone</strong>",
                            "content": "Flood insurance is typically required for homeowners in a 100-year flood zone, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>."
                          });
                        this.view_object.layer._100_zones._flood_zones.name = "_100_zone"
                        this.set_topo_layer(this.view_object.layer._100_zones._flood_zones);
                        this.view_object.layer._500_zones._flood_zones.name = "_500_zone"
                        this.set_topo_layer(this.view_object.layer._500_zones._flood_zones);
                    } else if (_100_value === true && _500_value === false){
                        $.jAlert({
                            "replaceOtherAlerts": true,
                            "closeOnClick": true,
                            "theme": "black",
                            "title": "<strong>You're in a 100-year flood zone</strong>",
                            "content": "Flood insurance is typically required for homeowners in these areas, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>."
                          });
                        this.view_object.layer._100_zones._flood_zones.name = "_100_zone"
                        this.set_topo_layer(this.view_object.layer._100_zones._flood_zones);
                    } else if (_100_value === false && _500_value === true){
                        $.jAlert({
                            "replaceOtherAlerts": true,
                            "closeOnClick": true,
                            "theme": "black",
                            "title": "<strong>You're in a 500-year flood zone</strong>",
                            "content": "Flood insurance isn't required for in these areas, which have a 0.2 percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). That may seem low, but the risks are real. Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>."
                        });
                        this.view_object.layer._500_zones._flood_zones.name = "_500_zone"
                        this.set_topo_layer(this.view_object.layer._500_zones._flood_zones);
                    } else {
                        $.jAlert({
                            "replaceOtherAlerts": true,
                            "closeOnClick": true,
                            "theme": "yellow",
                            "title": "<strong>Sorry</strong>",
                            "content": "We were unable to complete your search."
                          });
                    };
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
                var _100_zones = _this.view_object._100_wherewolf.find(user_here, {wholeFeature: true});
                var _500_zones = _this.view_object._500_wherewolf.find(user_here, {wholeFeature: true});
                return {"_100_zones": _100_zones, "_500_zones": _500_zones, "user_here": user_here};
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
            console.log(geo_data.name);
            this.topoLayer = new L.TopoJSON();
            this.topoLayer.addData(geo_data);
            if (geo_data.name === "_100_zone"){
                var thisFillColor = "#f07a30";
            } else if (geo_data.name === "_500_zone"){
                var thisFillColor = "#30a6f0";
            };
            this.topoLayer.eachLayer(function (layer){
                layer.setStyle({
                    fillColor: thisFillColor,
                    fillOpacity: .85,
                    color: '#000000',
                    weight: .85,
                    opacity: .85
                });
            });
            this.topoLayer.addTo(this.view_object.map);
        }
    });
