var jqueryNoConflict = jQuery;
var fn = fn || {};

var selectedCount = 0;

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.createMap();
});

// begin data configuration object
var fn = {

    addABunchOfNumbers: function(total_figure, lt_20000_gt_30, ab_20000_to_34999_gt_30, ab_35000_to_49999_gt_30, ab_50000_to_74999_gt_30, ab_75000_or_more_gt_30){
        var total = lt_20000_gt_30 + ab_20000_to_34999_gt_30 + ab_35000_to_49999_gt_30 + ab_50000_to_74999_gt_30 + ab_75000_or_more_gt_30;
        var value = (total / total_figure) * 100
        return value.toFixed(2) + "%";
    },

    percentifyValue: function(value){
        var value = value * 100
        return value.toFixed(2) + "%";
    },

    testFunction: function(dividend, divisor){
        var value = (dividend / divisor)*100
        return value.toFixed(2) + "%";
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
            initialZoom = 10;
        }

        map = new L.map('content-map-canvas', {
            scrollWheelZoom: false,
            zoomControl: true
        });

        var geojson = L.geoJson(zipCodeRent, {

            filter: function(feature, layer) {
                if (feature.properties.normalized_zcta_five_county_data_rent_housing_units_pct > .5){
                    return feature.properties;
                } else {
                    return false;
                }
            },

            style: function (feature) {
                var layer_color;
                if (feature.properties){
                    layer_color = '#f07a30';
                }

                return {
                    color: '#000000',
                    weight: .8,
                    opacity: .8,
                    fillOpacity: .5,
                    fillColor: layer_color
                }
            },

            onEachFeature: function(feature, layer) {

                feature.selected = false;

                var featcherContent = _.template(
                    "<tr id='zip_<%= name %>'>" +
                    "<td><%= name %></td>" +
                    "<td><%= normalized_zcta_five_county_data_county_proper %></td>" +
                    "<td><%= normalized_zcta_five_county_data_total_housing_units %></td>" +
                    "<td><%= normalized_zcta_five_county_data_own_housing_units_total %></td>" +
                    "<td><%= normalized_zcta_five_county_data_rent_housing_units_total %></td>", feature.properties);

                var featcherSentence = _.template(
                    "<p id='zip_<%= name %>'>Zip code tabulation area <%= name %> in <span class='experts'><%= normalized_zcta_five_county_data_county_proper %> County</span> has <%= fn.addCommas(normalized_zcta_five_county_data_total_housing_units) %> total housing units. <%= fn.addCommas(normalized_zcta_five_county_data_rent_housing_units_total) %> (<%= fn.percentifyValue(normalized_zcta_five_county_data_rent_housing_units_pct) %>) of those are occupied by renters. Of the <%= fn.addCommas(normalized_zcta_five_county_data_rent_housing_units_total) %> housing units occupied by renters...<br />" +

                        "<br />" +
                        "<br />" +

                        "<%= fn.addABunchOfNumbers(normalized_zcta_five_county_data_rent_housing_units_total, normalized_zcta_five_county_data_rent_lt_20000_lt_20_total, normalized_zcta_five_county_data_rent_20000_to_34999_lt_20_total, normalized_zcta_five_county_data_rent_35000_to_49999_lt_20_total, normalized_zcta_five_county_data_rent_50000_to_74999_lt_20_total, normalized_zcta_five_county_data_rent_75000_or_more_lt_20_total) %> pay less than 20% of their income toward rent.<br />" +

                        "<%= fn.addABunchOfNumbers(normalized_zcta_five_county_data_rent_housing_units_total, normalized_zcta_five_county_data_rent_lt_20000_20_to_29_total, normalized_zcta_five_county_data_rent_20000_to_34999_20_to_29_total, normalized_zcta_five_county_data_rent_35000_to_49999_20_to_29_total, normalized_zcta_five_county_data_rent_50000_to_74999_20_to_29_total, normalized_zcta_five_county_data_rent_75000_or_more_20_to_29_total) %> pay 20_to_29% of their income toward rent.<br />" +

                        "<%= fn.addABunchOfNumbers(normalized_zcta_five_county_data_rent_housing_units_total, normalized_zcta_five_county_data_rent_lt_20000_gt_30_total, normalized_zcta_five_county_data_rent_20000_to_34999_gt_30_total, normalized_zcta_five_county_data_rent_35000_to_49999_gt_30_total, normalized_zcta_five_county_data_rent_50000_to_74999_gt_30_total, normalized_zcta_five_county_data_rent_75000_or_more_gt_30_total) %> pay more than 30% of their income toward rent.<br />" +

                    "</p>", feature.properties);



                layer.on('click', function (e) {

                    console.log(feature);

                    if (selectedCount === 9){
                        jqueryNoConflict("#content-map-data").append("Clear the map");
                    }

                    console.log(selectedCount);

                    if (feature.selected === false){
                        this.setStyle({
                            weight: 2,
                            opacity: 2,
                            fillOpacity: 2,
                        });

                        //jqueryNoConflict("#appendHere").append(featcherContent);

                        jqueryNoConflict("#zipCodeSentence").append(featcherSentence);

                        feature.selected = true;

                        selectedCount = selectedCount + 1;

                    } else {
                        this.setStyle({
                            weight: .8,
                            opacity: .8,
                            fillOpacity: .5,
                        });

                        jqueryNoConflict("table #appendHere #zip_" + feature.properties.name).remove();

                        jqueryNoConflict("#zipCodeSentence #zip_" + feature.properties.name).remove();

                        feature.selected = false;
                    }

                });

            }

        }).addTo(map);

        map
            .setView(center, initialZoom)
            .addLayer(stamenToner);

    }

}
// end data configuration object