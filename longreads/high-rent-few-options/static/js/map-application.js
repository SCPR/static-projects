var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.createMap();
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

            var featcherSentence = _.template(
                "<div id='zip_<%= name %>'>" +
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

    createMap: function(){
        var initialZoom;
        var center = new L.LatLng(34.000304,-118.238039);
        var stamenToner = L.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png", {
            attribution: "Map tiles by <a href='http://stamen.com' target='_blank'>Stamen Design</a>, <a href='http://creativecommons.org/licenses/by/3.0' target='_blank'>CC BY 3.0</a> &mdash; Map data &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>",
            minZoom: 6,
            maxZoom: 14
        });

        // set zoom for mobile devices
        if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            initialZoom = 7;
        } else {
            initialZoom = 9;
        }

        map = new L.map('content-map-canvas', {
            scrollWheelZoom: false,
            zoomControl: false
        });

        map.addControl(L.control.zoom({
            position: 'topright'
        }))

        var geojsonOne = L.geoJson(zipCodeRentOne, {
            filter: fn.filterFeatures,
            style: fn.styleFeatures,
            onEachFeature: fn.onEachFeature
        }).addTo(map);

        var geojsonTwo = L.geoJson(zipCodeRentTwo, {
            filter: fn.filterFeatures,
            style: fn.styleFeatures,
            onEachFeature: fn.onEachFeature
        }).addTo(map);

        map
            .setView(center, initialZoom)
            .addLayer(stamenToner);
    }
}
// end data configuration object