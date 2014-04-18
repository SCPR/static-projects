var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function(){

    fn.determineZoomLevel();

    jqueryNoConflict("input[id='addressSearch']").geocomplete({
        details: "form"
    });

    $("#addressSearch").keyup(function(e){
        fn.evaluateKeyCode(e);
    });

    jqueryNoConflict("button#submit").on("click", function(){
        fn.addressSearch();
    });

    jqueryNoConflict("a.findMe").on("click", function(){
        fn.findMe();
    });

    jqueryNoConflict("button#reset").on("click", function(){
        fn.resetUserView();
    });

});

// begin data configuration object
var fn = {

    percentifyValue: function(value){
        var value = value * 100
        return parseFloat(value.toFixed(2));
    },

    toFixed: function(value){
        var decimal = parseFloat(value);
        return decimal.toFixed(0);
    },

    rentToIncome: function(rent, income, numberOfRenters){
        var avgIncome = income / numberOfRenters;
        var avgRent = rent / numberOfRenters;
        var rentToIncome = (avgRent / avgIncome) * 100;
        var calculatedAmount = parseFloat(rentToIncome.toFixed(0));
        return fn.addCommas(calculatedAmount);
    },

    addCommas: function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
            return x1 + x2;
    },

    evaluateKeyCode: function(e){
        var latitude = jqueryNoConflict("input[id='latitudeSearch']").val();
        var longitude = jqueryNoConflict("input[id='longitudeSearch']").val();

        if(e.keyCode != 13) {
            return false;
        } else if (e.keyCode === 13 && latitude === '' && longitude === '') {
            return false;
        } else {
            fn.addressSearch();
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
        if (feature.properties.la_area_rent_rent_gt30_pct >= 0.50){
            layer_color = '#d94701';
        } else {
            layer_color = '#fdbe85';
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

            jqueryNoConflict("#main-controls").hide();
            jqueryNoConflict("div.reset").show();

            var featcherSentence = _.template(
                "<div id='zip_<%= name %>'>" +
                    "<h2>Displaying data for ZCTA <%= name %></h2>" +
                    "<h4>Renters occupy an estimated <span class='gt-30pct'><%= fn.addCommas(la_area_rent_rent_total) %> </span> households in <%= la_area_rent_county_proper %> County's <a href='http://censusreporter.org/profiles/86000US<%= name %>-<%= name %>/'><%= name %></a> Zip Code Tabulation Area (<a href='http://www.census.gov/geo/reference/zctas.html' target='_blank'>ZCTA</a>), according to American Community Survey data.</h4>" +

                    "<% if (la_area_rent_median_gross_rent != null ) { %>" +
                        "<% if (la_area_rent_median_gross_rent_cv > 0.10) { %>" +
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_gross_rent) %> †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_gross_rent) %></span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<% if (la_area_rent_median_household_income_renter != null ) { %>" +
                        "<% if (la_area_rent_median_household_income_renter_cv > 0.10) { %>" +
                            "<h4><strong>Median annual income</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_household_income_renter) %> †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median annual income</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_household_income_renter) %></span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<% if (la_area_rent_median_gross_rent_pct != null ) { %>" +
                        "<% if (la_area_rent_median_gross_rent_cv > 0.10) { %>" +
                            "<h4><strong>Median rent burden</strong>: <span class='gt-30pct'><%= fn.toFixed(la_area_rent_median_gross_rent_pct) %>% †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median rent burden</strong>: <span class='gt-30pct'><%= fn.toFixed(la_area_rent_median_gross_rent_pct) %>%</span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<h4>Here's the breakdown of this area's household rent burden as a percentage of its income:</h4>" +
                "</div>", feature.properties);

            var featcherGraphs = _.template(
            "<ul class='chartlist'>" +
                "<li>" +
                    "<a href='javascript:void(0)'>More than 50% of income</a>" +
                    "<% if (la_area_rent_rent_gt_50_cv > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>% </span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                "<a href='javascript:void(0)'>40 to 49.9%</a>" +
                    "<% if (la_area_rent_rent_40_to_49_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% </span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>35 to 39.9%</a>" +
                    "<% if (la_area_rent_rent_35_to_39_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>30 to 34.9%</a>" +
                    "<% if (la_area_rent_rent_30_to_34_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>25 to 29.9%</a>" +
                    "<% if (la_area_rent_rent_25_to_29_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>20 to 24.9%</a>" +
                    "<% if (la_area_rent_rent_20_to_24_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>15 to 19.9%</a>" +
                    "<% if (la_area_rent_rent_15_to_19_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>10 to 14.9%</a>" +
                    "<% if (la_area_rent_rent_10_to_14_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>Less than 10 %</a>" +
                    "<% if (la_area_rent_rent_lt_10_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>Not calculated</a>" +
                    "<% if (la_area_rent_rent_not_computed_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>%'>&nbsp;</span>" +
                "</li>" +
            "</ul>", feature.properties);

            var featcherCaveat = _.template(
                "<p class='content-map-methodology gt-30pct'>† - Margin of error is at least 10 percent of the total value.</p>");

            jqueryNoConflict("#data-point-sentence").html(featcherSentence);
            jqueryNoConflict("#data-point-display").html(featcherGraphs);
            jqueryNoConflict("#data-point-caveat").html(featcherCaveat);
        });
    },

    determineZoomLevel: function(){
        var userLayer = new L.layerGroup();
        var initialZoom;
        var map;

        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            initialZoom = 7;
        } else {
            initialZoom = 9;
        }

        fn.initialMapState.initMap = map;
        fn.initialMapState.initUserLayer = userLayer;
        fn.initialMapState.initZoom = initialZoom;
        fn.createMap(fn.initialMapState);
    },

    initialMapState: {
        initMap: null,
        initUserLayer: null,
        initZoom: null,
        initLat: 34.000304,
        initLng: -118.238039,
        geoJsonLayers: null
    },

    createMap: function(initialMapState){
        var center = new L.LatLng(initialMapState.initLat, initialMapState.initLng);
        var zoom = initialMapState.initZoom;

        var stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
            attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
            minZoom: 6,
            maxZoom: 14
        });

        initialMapState.initMap = new L.map('content-map-canvas', {
            scrollWheelZoom: false,
            zoomControl: false
        });

        initialMapState.initMap.addControl(L.control.zoom({
            position: 'topright'
        }))

        var geojsonOne = L.geoJson(zipCodeRentOne, {
            filter: fn.filterFeatures,
            style: fn.styleFeatures,
            onEachFeature: fn.onEachFeature
        }).addTo(initialMapState.initMap);

        var geojsonTwo = L.geoJson(zipCodeRentTwo, {
            filter: fn.filterFeatures,
            style: fn.styleFeatures,
            onEachFeature: fn.onEachFeature
        }).addTo(initialMapState.initMap);

        initialMapState.geoJsonLayers = [geojsonOne, geojsonTwo];

        initialMapState.initMap
            .setView(center, zoom)
            .addLayer(stamenToner);
    },

    addressSearch: function(){
        var latitude = jqueryNoConflict("input[id='latitudeSearch']").val();
        var longitude = jqueryNoConflict("input[id='longitudeSearch']").val();
        fn.navigate();
    },

    findMe: function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                jqueryNoConflict("input[id='latitudeSearch']").val(position.coords.latitude);
                jqueryNoConflict("input[id='longitudeSearch']").val(position.coords.longitude);
                jqueryNoConflict("input[id='accuracySearch']").val(position.coords.accuracy);
                fn.navigate();
            }, null);
        } else {
            alert("Sorry, we could not find your location.");
        }
    },

    navigate: function(){
        var latitude = jqueryNoConflict("input[id='latitudeSearch']").val();
        var longitude = jqueryNoConflict("input[id='longitudeSearch']").val();
        var accuracy = jqueryNoConflict("input[id='accuracySearch']").val();
        var searchRadius = jqueryNoConflict("select[id='search-radius']").val();
        if (latitude === '' && longitude === ''){
            alert('Please enter an address or search by location')
        } else {
            fn.addUserLayerToMap(latitude, longitude, accuracy, searchRadius);
        }
    },

    addUserLayerToMap: function(latitude, longitude, accuracy, searchRadius){
        jqueryNoConflict("#main-controls").hide();
        jqueryNoConflict("div.reset").show();

        var userLocationCenter = new L.LatLng(latitude, longitude);

        var userLocationMarker = L.userMarker([latitude, longitude], {
            pulsing: true,
            smallIcon: true,
            accuracy: accuracy
        });

        var userRadius = L.circle([latitude, longitude], searchRadius, {
            clickable: false,
            opacity: 0.3,
            weight: 1,
            color: '#000000',
            fillColor: '#ffffff',
            fillOpacity: 0.3
        });

        fn.initialMapState.initUserLayer
            .addLayer(userLocationMarker)
            .addLayer(userRadius);

        fn.initialMapState.initUserLayer.addTo(fn.initialMapState.initMap);

        fn.initialMapState.initMap.fitBounds(userRadius.getBounds());

        var testFeature;
        for (var i=0; i<fn.initialMapState.geoJsonLayers.length; i++){
            if (leafletPip.pointInLayer([longitude, latitude], fn.initialMapState.geoJsonLayers[i]).length != 0){
                testFeature = leafletPip.pointInLayer([longitude, latitude], fn.initialMapState.geoJsonLayers[i]);
            }
        }

        if (testFeature != undefined){
            var featcherSentence = _.template(
                "<div id='zip_<%= name %>'>" +
                    "<h2>Displaying data for ZCTA <%= name %></h2>" +
                    "<h4>Renters occupy an estimated <span class='gt-30pct'><%= fn.addCommas(la_area_rent_rent_total) %> </span> households in <%= la_area_rent_county_proper %> County's <a href='http://censusreporter.org/profiles/86000US<%= name %>-<%= name %>/'><%= name %></a> Zip Code Tabulation Area (<a href='http://www.census.gov/geo/reference/zctas.html' target='_blank'>ZCTA</a>), according to American Community Survey data.</h4>" +

                    "<% if (la_area_rent_median_gross_rent != null ) { %>" +
                        "<% if (la_area_rent_median_gross_rent_cv > 0.10) { %>" +
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_gross_rent) %> †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median monthly rent</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_gross_rent) %></span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<% if (la_area_rent_median_household_income_renter != null ) { %>" +
                        "<% if (la_area_rent_median_household_income_renter_cv > 0.10) { %>" +
                            "<h4><strong>Median annual income</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_household_income_renter) %> †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median annual income</strong>: <span class='gt-30pct'>$<%= fn.addCommas(la_area_rent_median_household_income_renter) %></span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<% if (la_area_rent_median_gross_rent_pct != null ) { %>" +
                        "<% if (la_area_rent_median_gross_rent_cv > 0.10) { %>" +
                            "<h4><strong>Median rent burden</strong>: <span class='gt-30pct'><%= fn.toFixed(la_area_rent_median_gross_rent_pct) %>% †</span></h4>" +
                        "<% } else { %>" +
                            "<h4><strong>Median rent burden</strong>: <span class='gt-30pct'><%= fn.toFixed(la_area_rent_median_gross_rent_pct) %>%</span></h4>" +
                        "<% } %>" +
                    "<% } %>" +

                    "<h4>Here's the breakdown of this area's household rent burden as a percentage of its income:</h4>" +
                "</div>", testFeature[0].feature.properties);

            var featcherGraphs = _.template(
            "<ul class='chartlist'>" +
                "<li>" +
                    "<a href='javascript:void(0)'>More than 50% of income</a>" +
                    "<% if (la_area_rent_rent_gt_50_cv > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>% </span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_gt_50_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                "<a href='javascript:void(0)'>40 to 49.9%</a>" +
                    "<% if (la_area_rent_rent_40_to_49_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>% </span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_40_to_49_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>35 to 39.9%</a>" +
                    "<% if (la_area_rent_rent_35_to_39_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_35_to_39_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>30 to 34.9%</a>" +
                    "<% if (la_area_rent_rent_30_to_34_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_30_to_34_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>25 to 29.9%</a>" +
                    "<% if (la_area_rent_rent_25_to_29_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_25_to_29_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>20 to 24.9%</a>" +
                    "<% if (la_area_rent_rent_20_to_24_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_20_to_24_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>15 to 19.9%</a>" +
                    "<% if (la_area_rent_rent_15_to_19_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_15_to_19_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>10 to 14.9%</a>" +
                    "<% if (la_area_rent_rent_10_to_14_9_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_10_to_14_9_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>Less than 10 %</a>" +
                    "<% if (la_area_rent_rent_lt_10_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_lt_10_pct) %>%'>&nbsp;</span>" +
                "</li>" +
                "<li>" +
                    "<a href='javascript:void(0)'>Not calculated</a>" +
                    "<% if (la_area_rent_rent_not_computed_pct > 0.10) { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>% †</span>" +
                    "<% } else { %>" +
                        "<span class='count'><%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>%</span>" +
                    "<% } %>" +
                    "<span class='index' style='width: <%= fn.percentifyValue(la_area_rent_rent_not_computed_pct) %>%'>&nbsp;</span>" +
                "</li>" +
            "</ul>", testFeature[0].feature.properties);

            var featcherCaveat = _.template(
                "<p class='content-map-methodology gt-30pct'>† - Margin of error is at least 10 percent of the total value.</p>");

            jqueryNoConflict("#data-point-sentence").html(featcherSentence);
            jqueryNoConflict("#data-point-display").html(featcherGraphs);
            jqueryNoConflict("#data-point-caveat").html(featcherCaveat);
        } else {
            jqueryNoConflict("#data-point-sentence").html(
                "<h2>We couldn't find data for this ZCTA</h2>");
        }
    },

    resetUserView: function(){
        jqueryNoConflict("select[id='search-radius']").val(
            jqueryNoConflict("select[id='search-radius']").prop('defaultSelected')
        );
        jqueryNoConflict("input[id='addressSearch']").val('');
        jqueryNoConflict("input[id='latitudeSearch']").val('');
        jqueryNoConflict("input[id='latitudeSearch']").val('');
        jqueryNoConflict("input[id='longitudeSearch']").val('');
        jqueryNoConflict("input[id='accuracySearch']").val('');
        jqueryNoConflict("#main-controls").show();
        jqueryNoConflict("div.reset").hide();
        jqueryNoConflict("#data-point-sentence").empty();
        jqueryNoConflict("#data-point-display").empty();
        jqueryNoConflict("#data-point-caveat").empty();

        fn.initialMapState.initUserLayer.clearLayers();

        var centerReset = new L.LatLng(fn.initialMapState.initLat, fn.initialMapState.initLng);
        var zoomReset = fn.initialMapState.initZoom;
        fn.initialMapState.initMap.setView(centerReset, zoomReset);
    }
}
// end data configuration object