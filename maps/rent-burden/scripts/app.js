    App.Router = Backbone.Router.extend({
        initialize: function(){
            $.fn.jAlert.defaults.backgroundColor = "white";
            window.config = {};

            window.config.prelim_counties = [
                "Humboldt County",
                "Placer County",
                "San Francisco County"
            ];

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
            "*notFound": "fetchData"
        },

        fetchData: function(){
            this.render_application_visuals(window.config);
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
            this.markerGroup = new L.layerGroup();
            window.featcherSentence = _.template(
                "<div id='zip_<%= name %>'>"+
                    "<h2 class='data-h2'>ZCTA <%= name %></h2>"+
                    "<% if (la_area_rent_median_gross_rent_pct != null ) { %>"+
                        "<% if (la_area_rent_median_gross_rent_cv > 0.30) { %>"+
                            "<h3><%= this.toFixed(la_area_rent_median_gross_rent_pct) %>% of income†</h3>"+
                        "<% } else { %>"+
                            "<h3><%= this.toFixed(la_area_rent_median_gross_rent_pct) %>% of income</h3>"+
                        "<% } %>"+
                    "<% } %>"+
                    "<h4><strong>Total households that rent</strong>: <span class='gt-30pct'><%= this.addCommas(la_area_rent_rent_total) %> </span></h4>"+
                    "<% if (la_area_rent_median_gross_rent != null ) { %>"+
                        "<% if (la_area_rent_median_gross_rent_cv > 0.30) { %>"+
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= this.addCommas(la_area_rent_median_gross_rent) %> †</span></h4>"+
                        "<% } else { %>"+
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= this.addCommas(la_area_rent_median_gross_rent) %></span></h4>"+
                        "<% } %>"+
                    "<% } %>"+
                    "<% if (la_area_rent_median_household_income_renter != null ) { %>"+
                        "<% if (la_area_rent_median_household_income_renter_cv > 0.30) { %>"+
                            "<h4><strong>Median annual income(e)</strong>: <span class='gt-30pct'>$<%= this.addCommas(la_area_rent_median_household_income_renter) %> †</span></h4>"+
                        "<% } else { %>"+
                            "<h4><strong>Median annual income</strong>: <span class='gt-30pct'>$<%= this.addCommas(la_area_rent_median_household_income_renter) %></span></h4>"+
                        "<% } %>"+
                    "<% } %>"+
                    "<h4 class='data-charts'>Detailed breakdown</h4>"+
                "</div>");
            window.featcherGraphs = _.template(
                "<ul class='chartlist'>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>More than 50% of income</a>"+
                        "<% if (la_area_rent_rent_gt_50_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_gt_50_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_gt_50_pct) %>% </span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_gt_50_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                    "<a href='javascript:void(0)'>40 to 49.9%</a>"+
                        "<% if (la_area_rent_rent_40_to_49_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% </span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>35 to 39.9%</a>"+
                        "<% if (la_area_rent_rent_35_to_39_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>30 to 34.9%</a>"+
                        "<% if (la_area_rent_rent_30_to_34_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>25 to 29.9%</a>"+
                        "<% if (la_area_rent_rent_25_to_29_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>20 to 24.9%</a>"+
                        "<% if (la_area_rent_rent_20_to_24_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>15 to 19.9%</a>"+
                        "<% if (la_area_rent_rent_15_to_19_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>10 to 14.9%</a>"+
                        "<% if (la_area_rent_rent_10_to_14_9_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>Less than 10 %</a>"+
                        "<% if (la_area_rent_rent_lt_10_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_lt_10_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_lt_10_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_lt_10_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                    "<li>"+
                        "<a href='javascript:void(0)'>Not calculated</a>"+
                        "<% if (la_area_rent_rent_not_computed_cv > 0.30) { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_not_computed_pct) %>% †</span>"+
                        "<% } else { %>"+
                            "<span class='count'><%= this.percentifyValue(la_area_rent_rent_not_computed_pct) %>%</span>"+
                        "<% } %>"+
                        "<span class='index' style='width: <%= this.percentifyValue(la_area_rent_rent_not_computed_pct) %>%'>&nbsp;</span>"+
                    "</li>"+
                "</ul>");
            this.view_object.stamenTerrain = L.tileLayer("http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png", {
                attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
                subdomains: "abcd",
                minZoom: 4,
                maxZoom: 15
            });
            this.view_object.mapQuest = new L.tileLayer(
                "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
                    attribution: "Tiles, data, imagery and map information provided by <a href='http://www.mapquest.com' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'>, <a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a> and OpenStreetMap contributors.",
                    subdomains: ["otile1","otile2","otile3","otile4"]
            });
            this.view_object.osm = new L.TileLayer(
                "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    minZoom: 8,
                    maxZoom: 12,
                    attribution: "Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors"
                }
            );
            if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
                this.view_object.zoom = 7;
            } else {
                this.view_object.zoom = 9;
            };
            this.view_object.center = new L.LatLng(34.000304, -118.238039);
            this.view_object.geojsonOne = L.geoJson(zipCodeRentOne, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
            this.view_object.geojsonTwo = L.geoJson(zipCodeRentTwo, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
            this.view_object.geoJsonLayers = [this.view_object.geojsonOne, this.view_object.geojsonTwo];
            this.render(this.view_object);
        },

        events: {
            "click a.findMe": "findMe",
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
            "click button#reset": "resetUserView",
            "change #search-radius": "navigate",
            // "click [type='checkbox']": "getCheckboxIds",
        },

        render: function(){
            $(this.el).html(this.template);
            this.view_object.map = L.map("content-map-canvas", {
                scrollWheelZoom: false,
                // zoomControl: true,
                minZoom: 6,
                maxZoom: 15
            });
            this.view_object.map.setView(this.view_object.center, this.view_object.zoom);
            this.view_object.map.addLayer(this.view_object.stamenTerrain);
            this.view_object.geojsonOne.addTo(this.view_object.map);
            this.view_object.geojsonTwo.addTo(this.view_object.map);
        },

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
            var latitude = $("input[id='latitudeSearch']").val();
            var longitude = $("input[id='longitudeSearch']").val();
            var accuracy = $("input[id='accuracySearch']").val();
            var searchRadius = $("select[id='search-radius']").val();
            if (latitude === '' && longitude === ''){
                alert('Please enter an address or search by location')
            } else {
                if (this.view_object.map.hasLayer(this.userLayer)){
                    this.view_object.map.removeLayer(this.userLayer);
                }
                this.markerGroup.clearLayers();
                this.addUserLayerToMap(latitude, longitude, accuracy, searchRadius);
            }
        },

        filterFeatures: function(feature, layer) {
            if (feature.properties.la_area_rent_rent_total != 0 || feature.properties.la_area_rent_rent_total != null){
                return feature.properties;
            } else {
                return false;
            }
        },

        styleFeatures: function (feature) {
            var layer_color;
            if (parseFloat(feature.properties.la_area_rent_median_gross_rent_pct) >= 40){
                layer_color = '#023747'; //#007397
            } else if (parseFloat(feature.properties.la_area_rent_median_gross_rent_pct) < 30){
                layer_color = '#CCEDF8'; //#EDF2F4
            } else if (30 <= parseFloat(feature.properties.la_area_rent_median_gross_rent_pct) < 40){
                layer_color = '#31ABD4'; //#CCEDF8
            }

            return {
                color: '#000000',
                weight: 0.7,
                opacity: 0.7,
                fillOpacity: 0.6,
                fillColor: layer_color
            }
        },

        onEachFeature: function(feature, layer) {
            layer.on('click', function (e) {
                $("div.reset").show();
                $("#data-point-sentence").html(window.featcherSentence(feature.properties));
                $("#data-point-display").html(window.featcherGraphs(feature.properties));
                $("#data-point-caveat").html(
                    "<p class='content-map-methodology gt-30pct'>† - Reliability of estimate may be low, based on margin of error</p>"
                );
                $("#pin-query-response").empty();
            });
        },

        resetUserView: function(){
            $("select[id='search-radius']").val(
                $("select[id='search-radius']").prop('defaultSelected')
            );
            $("input[id='addressSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='latitudeSearch']").val('');
            $("input[id='longitudeSearch']").val('');
            $("input[id='accuracySearch']").val('');
            // $("#main-controls").show(); ###
            $("div.reset").hide();
            $("#data-point-sentence").empty();
            $("#data-point-display").empty();
            $("#data-point-caveat").empty();
            $("#pin-query-response").empty();
            $("input[type='checkbox']").attr('checked', false);

            if (this.view_object.map.hasLayer(this.userLayer)){
                this.view_object.map.removeLayer(this.userLayer);
            }

            this.markerGroup.clearLayers();
            this.view_object.map.setView(this.view_object.center, this.view_object.zoom);
        },

        addUserLayerToMap: function(latitude, longitude, accuracy, searchRadius){
            // $("#main-controls").hide(); ###
            $("div.reset").show();
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
                color: '#000000',
                fillColor: '#ffffff',
                fillOpacity: 0.3
            });
            this.userLayer = new L.layerGroup();
            this.userLayer.addLayer(this.userLocationMarker).addLayer(this.userRadius);
            this.userLayer.addTo(this.view_object.map);
            // this.map.fitBounds(this.userRadius.getBounds());
            this.view_object.map.setView(this.userLocationMarker.getLatLng(),13)
            this.findFeatureForLatLng(latitude, longitude);
            // this.userLocationCenter = new L.LatLng(latitude, longitude);
            // this.userLocationMarker = L.userMarker([latitude, longitude], {
            //     pulsing: true,
            //     smallIcon: true
            // });
            // this.userRadius = L.circle([latitude, longitude], 20, {
            //     clickable: false,
            //     opacity: 0.3,
            //     weight: 1,
            //     color: '#ec792b',
            //     fillColor: '#ec792b',
            //     fillOpacity: 0.3
            // });
            // this.userLayer = new L.layerGroup();
            // this.userLayer.addLayer(this.userLocationMarker);
            // this.userLayer.addTo(this.view_object.map);
            // this.view_object.map.fitBounds(this.userRadius.getBounds());
        },

        // raiseFloodZoneAlert: function(latitude, longitude){
        //     this.view_object.layer = this.findFeatureForLatLng(parseFloat(latitude), parseFloat(longitude));
        //     var prelim_county = _.contains(window.config.prelim_counties, this.view_object.layer.county_name);
        //     if (this.view_object.layer === false){
        //         $.jAlert({
        //             "replaceOtherAlerts": true,
        //             "closeOnClick": true,
        //             "theme": "yellow",
        //             "title": "<strong>Sorry</strong>",
        //             "content": "We're only equipped to find flood zones in California."
        //           });
        //         $("button#reset").trigger("click");
        //     } else {
        //         var _100_null = _.isNull(this.view_object.layer._100_zones._flood_zones);
        //         var _100_undefined = _.isUndefined(this.view_object.layer._100_zones._flood_zones);
        //         var _100_value = _.isObject(this.view_object.layer._100_zones._flood_zones)
        //         var _500_null = _.isNull(this.view_object.layer._500_zones._flood_zones);
        //         var _500_undefined = _.isUndefined(this.view_object.layer._500_zones._flood_zones);
        //         var _500_value = _.isObject(this.view_object.layer._500_zones._flood_zones)
        //         $("#reset").removeClass("hidden");
        //         if (_100_null === true && _500_null === true){
        //             var _no_zone_alert_content;
        //             if (prelim_county === true){
        //                 _no_zone_alert_content = "But that doesn't mean that your area can't flood, and flood maps in this area are still preliminary. FEMA estimates that a third of Federal Disaster Assistance goes to people outside of high-risk flood zones. <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>Here's how FEMA recommends you stay safe in a flood</a>. Check with FEMA for an official determination.";
        //             } else {
        //                 _no_zone_alert_content = "But that doesn't mean that your area can't flood. FEMA estimates that a third of Federal Disaster Assistance goes to people outside of high-risk flood zones. <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>Here's how FEMA recommends you stay safe in a flood</a>. Check with FEMA for an official determination.";
        //             };
        //             $.jAlert({
        //                 "replaceOtherAlerts": true,
        //                 "closeOnClick": true,
        //                 "theme": "black",
        //                 "title": "<strong>You're not in a flood zone</strong>",
        //                 "content": _no_zone_alert_content
        //             });
        //             }
        //          else if (_100_undefined === true && _500_undefined === true){
        //             $.jAlert({
        //                 "replaceOtherAlerts": true,
        //                 "closeOnClick": true,
        //                 "theme": "yellow",
        //                 "title": "<strong>Sorry</strong>",
        //                 "content": "We were unable to complete your search."
        //               });
        //         } else {
        //             if (_100_value === true && _500_value === true){
        //                 $.jAlert({
        //                     "replaceOtherAlerts": true,
        //                     "closeOnClick": true,
        //                     "theme": "black",
        //                     "title": "<strong>You're in a 100-year and 500-year flood zone</strong>",
        //                     "content": "Flood insurance is typically required for homeowners in a 100-year flood zone, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>. Check with FEMA for an official determination."
        //                   });
        //                 this.view_object.layer._100_zones._flood_zones.name = "_100_zone"
        //                 this.set_topo_layer(this.view_object.layer._100_zones._flood_zones);
        //                 this.view_object.layer._500_zones._flood_zones.name = "_500_zone"
        //                 this.set_topo_layer(this.view_object.layer._500_zones._flood_zones);
        //             } else if (_100_value === true && _500_value === false){
        //                 var _100_alert_content;
        //                 if (prelim_county === true){
        //                     _100_alert_content = "Flood insurance is typically required for homeowners in these areas, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). However, in this county, digital flood maps are preliminary and could change. Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>. Check with FEMA for an official determination.";
        //                 } else {
        //                     _100_alert_content = "Flood insurance is typically required for homeowners in these areas, which have a one percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>. Check with FEMA for an official determination.";
        //                 };
        //                 $.jAlert({
        //                     "replaceOtherAlerts": true,
        //                     "closeOnClick": true,
        //                     "theme": "black",
        //                     "title": "<strong>You're in a 100-year flood zone</strong>",
        //                     "content": _100_alert_content
        //                 });
        //                 this.view_object.layer._100_zones._flood_zones.name = "_100_zone"
        //                 this.set_topo_layer(this.view_object.layer._100_zones._flood_zones);
        //             } else if (_100_value === false && _500_value === true){
        //                 var _500_alert_content;
        //                 if (prelim_county === true){
        //                     _500_alert_content = "Flood insurance isn't required for in these areas, which have a 0.2 percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). That may seem low, but the risks are real. Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>. Note that, in this county, digital flood maps are preliminary and could change. Check with FEMA for an official determination.";
        //                 } else {
        //                     _500_alert_content = "Flood insurance isn't required for in these areas, which have a 0.2 percent annual chance of flooding (<a href='http://pubs.usgs.gov/gip/106/pdf/100-year-flood-handout-042610.pdf'>here's what that means</a>). That may seem low, but the risks are real. Here are FEMA's <a target='blank' href='http://www.fema.gov/media-library-data/1410529949526-528efb43b7b4e62726c47de7abf40bf0/FloodPreparationSafetyBrochure_F684_062014.pdf'>tips for preparing and making your emergency plan</a>. Check with FEMA for an official determination.";
        //                 };
        //                 $.jAlert({
        //                     "replaceOtherAlerts": true,
        //                     "closeOnClick": true,
        //                     "theme": "black",
        //                     "title": "<strong>You're in a 500-year flood zone</strong>",
        //                     "content": _500_alert_content
        //                 });
        //                 this.view_object.layer._500_zones._flood_zones.name = "_500_zone"
        //                 this.set_topo_layer(this.view_object.layer._500_zones._flood_zones);
        //             } else {
        //                 $.jAlert({
        //                     "replaceOtherAlerts": true,
        //                     "closeOnClick": true,
        //                     "theme": "yellow",
        //                     "title": "<strong>Sorry</strong>",
        //                     "content": "We were unable to complete your search."
        //                   });
        //             };
        //         };
        //     };
        // },

        findFeatureForLatLng: function(latitude, longitude){
            var value;
            for (var i=0; i<this.view_object.geoJsonLayers.length; i++){
                if (leafletPip.pointInLayer([longitude, latitude], this.view_object.geoJsonLayers[i]).length != 0){
                    value = leafletPip.pointInLayer([longitude, latitude], this.view_object.geoJsonLayers[i]);
                }
            }
            if (value != undefined){
                $("#data-point-sentence").html(window.featcherSentence(value[0].feature.properties));
                $("#data-point-display").html(window.featcherGraphs(value[0].feature.properties));
                $("#data-point-caveat").html(
                    "<p class='content-map-methodology gt-30pct'>† - Reliability of estimate may be low, based on margin of error</p>"
                );
            } else {
                $("#data-point-sentence").html(
                    "<h2>We couldn't find data for this ZCTA</h2>");
            }
            // if (value != undefined){
            //     $("#data-point-sentence").html(window.featcherSentence(value[0].feature.properties));
            //     $("#data-point-display").html(window.featcherGraphs(value[0].feature.properties));
            //     $("#data-point-caveat").html(
            //         "<p class='content-map-methodology gt-30pct'>† - Margin of error is too large to make this a reliable estimate.</p>"
            //     );
            // } else {
            //     $("#data-point-sentence").html(
            //         "<h2>We couldn't find data for this ZCTA</h2>");
            // }

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

        // set_topo_layer: function(geo_data){
        //     this.topoLayer = new L.TopoJSON();
        //     this.topoLayer.addData(geo_data);
        //     if (geo_data.name === "_100_zone"){
        //         var thisFillColor = "#f07a30";
        //     } else if (geo_data.name === "_500_zone"){
        //         var thisFillColor = "#30a6f0";
        //     };
        //     this.topoLayer.eachLayer(function (layer){
        //         layer.setStyle({
        //             fillColor: thisFillColor,
        //             fillOpacity: .85,
        //             color: '#000000',
        //             weight: .85,
        //             opacity: .85
        //         });
        //     });
        //     this.topoLayer.addTo(this.view_object.map);
        // }
    });
