    App.Router = Backbone.Router.extend({
        initialize: function(){
            $.fn.jAlert.defaults.backgroundColor = "white";
            window.config = {};

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
            this.layerGroup = new L.layerGroup();
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
            this.view_object.geojson = L.geoJson(zipCodeRent, {
                filter: this.filterFeatures,
                style: this.styleFeatures,
                onEachFeature: this.onEachFeature
            });
            this.view_object.legend = L.control({
                position: 'topright'
            });
            getColor = function(d) {
                return d == "Less than 30%" ? "#CCEDF8" :
                       d == "30% to 39%"    ? "#31ABD4" :
                                              "#023747";
            };
            this.view_object.legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    labels = ["Less than 30%", "30% to 39%", "40% or more"];
                div.innerHTML += '<strong>Income spent on rent:</strong><br>'
                for (var i = 0; i < labels.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(labels[i]) + '"></i> ' +
                        labels[i] + (labels[i + 1] ? '<br>' : '');
                }
                return div;
            };
            this.render(this.view_object);
        },

        events: {
            "click a.findMe": "findMe",
            "keyup :input": "addressSearch",
            "click button#submit": "navigate",
            // "click button#reset": "resetUserView",
            // "change #search-radius": "navigate",
            // "click [type='checkbox']": "getCheckboxIds",
        },

        render: function(){
            $(this.el).html(this.template);
            this.view_object.map = L.map("content-map-canvas", {
                scrollWheelZoom: true,
                zoomControl: false,
                minZoom: 6,
                maxZoom: 15
            });
            L.control.zoom({
                position:'bottomleft'
                }).addTo(this.view_object.map);
            this.view_object.map.setView(this.view_object.center, this.view_object.zoom);
            this.view_object.map.addLayer(this.view_object.stamenTerrain);
            this.view_object.geojson.addTo(this.view_object.map);
            this.view_object.legend.addTo(this.view_object.map);
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
            var searchRadius = 400; // $("select[id='search-radius']").val();
            if (latitude === '' && longitude === ''){
                alert('Please enter an address or search by location')
            } else {
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
            var popup = L.popup()
                .setContent('<div class="data-sentence">' +
                    window.featcherSentence(feature.properties) +
                    '</div>' +
                    '<div class="data-display">' +
                    window.featcherGraphs(feature.properties) +
                    '</div>'
                );
            layer.bindPopup(popup);
            layer.on('click', function (e) {
                var bounds = layer.getBounds();
                var latLng = bounds.getCenter();
                layer.openPopup(latLng);
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
            this.findFeatureForLatLng(latitude, longitude);
        },

        findFeatureForLatLng: function(latitude, longitude){
            var value;
            if (leafletPip.pointInLayer([longitude, latitude], this.view_object.geojson).length != 0){
                value = leafletPip.pointInLayer([longitude, latitude], this.view_object.geojson);
            }
            if (value != undefined){
                var layer = this.view_object.geojson.getLayer(value[0]._leaflet_id);
                var bounds = layer.getBounds();
                var latLng = bounds.getCenter();
                this.view_object.map.setView(latLng, 11, {
                    animate: true
                });
                layer.openPopup(latLng);
            } else {
                alert("We couldn't find data for this zip code tabulation area");
            }
        },

    });
