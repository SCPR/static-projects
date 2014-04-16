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

    averageRenter: function(value, numberOfRenters){
        var value = value / numberOfRenters;
        var calculatedAmount = parseFloat(value.toFixed(0));
        return fn.addCommas(calculatedAmount);
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

        var geojson = L.geoJson(zipCodeRent, {

            // don't return features where the pct is zero
            filter: function(feature, layer) {
                if (feature.properties.la_area_rent_rent_total != 0 || feature.properties.la_area_rent_rent_total != null){
                    if (feature.properties.la_area_rent_rent_total_cv <= 0.10){
                        return feature.properties;
                    }
                } else {
                    return false;
                }
            },

            //"#d94701", "#fd8d3c", "#fdbe85", "#feedde"

            style: function (feature) {
                var layer_color;
                if (feature.properties.la_area_rent_rent_gt30_pct >= 0.75){
                    layer_color = '#d94701';
                } else if (feature.properties.la_area_rent_rent_gt30_pct >= 0.50){
                    layer_color = '#fd8d3c';
                } else if (feature.properties.la_area_rent_rent_gt30_pct >= 0.25){
                    layer_color = '#fdbe85';
                } else {
                    layer_color = '#feedde';
                }

                /*
                if (feature.properties.la_area_rent_rent_total >= 10000){
                    layer_color = 'yellow';
                }
                */

                return {
                    color: '#000000',
                    weight: 0.7,
                    opacity: 0.7,
                    fillOpacity: 1.0,
                    fillColor: layer_color
                }
            },

            onEachFeature: function(feature, layer) {

                feature.selected = false;

                layer.on('click', function (e) {

                    var featcherSentence = _.template(
                        "<div id='zip_<%= name %>'>" +
                            "<h4>An estimated <span class='gt-30pct'><%= fn.addCommas(la_area_rent_rent_total) %> renters</span> call <%= la_area_rent_county_proper %> County's <a href='http://censusreporter.org/profiles/86000US<%= name %>-<%= name %>/' target='_blank'><%= name %></a> zip code tabulation area (ZCTA) home, according to American Community Survey data.</h4>" +
                            "<h4>The average renter here earns about <span class='gt-30pct'>$<%= fn.averageRenter(la_area_rent_rent_income_month_average, la_area_rent_rent_total) %></span> a month &ndash; based on aggregate data  &ndash; and spends an average of <span class='gt-30pct'>$<%= fn.averageRenter(la_area_rent_rent_aggregate_total, la_area_rent_rent_total) %></span> on rent each month <span class='gt-30pct'>(<%= fn.rentToIncome(la_area_rent_rent_aggregate_total, la_area_rent_rent_income_month_average, la_area_rent_rent_total) %>%)</span>.</h4>" +
                            "<h4>Here's a breakdown of what percent of their income renters pay in this ZCTA:</h4>" +
                        "</div>", feature.properties);

                    var featcherGraphs = _.template(
                    "<ul class='chartlist'>" +
                        "<li>" +
                            "<a href='javascript:void(0)'>More than 50%</a>" +
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

                    if (feature.selected === false){
                        this.setStyle({
                            weight: 2,
                            opacity: 2,
                        });
                        feature.selected = true;

                    } else {
                        this.setStyle({
                            weight: .8,
                            opacity: .8,
                        });
                        feature.selected = false;
                    }

                    console.log(feature);
                });
            }

        }).addTo(map);

        map
            .setView(center, initialZoom)
            .addLayer(stamenToner);
    }
}
// end data configuration object