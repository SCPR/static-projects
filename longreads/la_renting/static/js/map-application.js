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
        return parseFloat(value.toFixed(0));
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
                if (feature.properties.la_area_rent_rent_gt30_pct != 0){
                    return feature.properties;
                } else {
                    return false;
                }
            },

            style: function (feature) {
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
                    fillOpacity: 1.0,
                    fillColor: layer_color
                }
            },

            onEachFeature: function(feature, layer) {
                //feature.selected = false;
                var featcherSentence = _.template(
                    "<div id='zip_<%= name %>'>" +
                        "<h4><%= la_area_rent_county_proper %> County's <%= name %> is home to " +
                        "<% if (la_area_rent_rent_gt30_pct >= 0.50) { %>" +
                            "<span class='gt-30pct'><%= fn.addCommas(la_area_rent_rent_total) %> renters&nbsp;</span>" +
                        "<% } else { %>" +
                            "<span class='lt-30pct'><%= fn.addCommas(la_area_rent_rent_total) %> renters&nbsp;</span>" +
                        "<% } %>" +
                        "<% if (la_area_rent_rent_total_cv > 0.10) { %>" +
                            "<span class='content-map-methodology'>(+/- <%= la_area_rent_rent_total_error %>)†</span>" +
                        "<% } else { %>" +
                            "<span class='content-map-methodology'>(+/- <%= la_area_rent_rent_total_error %>)</span></h4>" +
                        "<% } %>" +
                    "</div>", feature.properties);

                var featcherCaveat = _.template(
                    "<p class='content-map-methodology'>† - Margin of error is at least 10 percent of the total value. Take care with this statistic.</p>");

                layer.on('click', function (e) {

                    jqueryNoConflict("#data-point-sentence").html(featcherSentence);
                    jqueryNoConflict("#data-point-display").empty();
                    jqueryNoConflict("#data-point-caveat").empty();

                    var dataPoints = [{
                            "val": fn.percentifyValue(feature.properties.la_area_rent_rent_high_pct),
                            "coefficientVariable": feature.properties.la_area_rent_rent_high_cv,
                            "moe": feature.properties.la_area_rent_rent_high_error,
                            "name": "High"
                        }, {
                            "val": fn.percentifyValue(feature.properties.la_area_rent_rent_medium_pct),
                            "coefficientVariable": feature.properties.la_area_rent_rent_medium_cv,
                            "moe": feature.properties.la_area_rent_rent_medium_error,
                            "name": "Medium"
                        }, {
                            "val": fn.percentifyValue(feature.properties.la_area_rent_rent_low_pct),
                            "coefficientVariable": feature.properties.la_area_rent_rent_low_cv,
                            "moe": feature.properties.la_area_rent_rent_low_error,
                            "name": "Low"
                        }, {
                            "val": fn.percentifyValue(feature.properties.la_area_rent_rent_not_computed_pct),
                            "coefficientVariable": feature.properties.la_area_rent_rent_not_computed_cv,
                            "moe": feature.properties.la_area_rent_rent_not_computed_error,
                            "name": "Not Computed"},
                    ];

                    var width = 420,
                        height = 420,
                        outerRadius = Math.min(width, height) / 2,
                        innerRadius = outerRadius * .6,
                        color = d3.scale.ordinal()
                            .range(["#d94701", "#fd8d3c", "#fdbe85", "#feedde"]);
                        donut = d3.layout.pie(),
                        arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

                    var vis = d3.select("#data-point-display")
                        .append("svg")
                        .data([dataPoints])
                        .attr("width", width)
                        .attr("height", height);

                    var arcs = vis.selectAll("g.arc")
                        .data(donut.value(function(d) {
                            return d.val
                        }))
                        .enter().append("g")
                        .attr("class", "arc")
                        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                    arcs.append("svg:path")
                        .attr("fill", function(d, i) {
                            return color(i);
                        })
                        .attr("stroke", "#000000")
                        .attr("stroke-width", 0.5)
                        .attr("d", arc);

                        /*
                        .on("mouseenter", function(d) {
                            arcs.append("text")
                                .attr("transform", arc.centroid(d))
                                .attr("dy", ".5em")
                                .style("text-anchor", "middle")
                                .style("fill", "#f07a30")
                                .attr("class", "on")
                                .text(d.data.name);
                        })
                        .on("mouseout", function(d) {
                            console.log(d);
                        });
                        */

                    arcs.append("svg:text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .attr("text-anchor", "middle")
                        .attr("display", function(d) {
                            return d.value > .15 ? null : "none";
                        })
                        .text(function(d, i) {
                            var dataPoint = d.data.val + "%"
                            var marginOfError = "(+/-" + d.data.moe + ")"
                            if (d.data.coefficientVariable >= 0.10){
                                return dataPoint + " † " + marginOfError;
                            } else {
                                return dataPoint + " " + marginOfError;
                            }

                        });

                    jqueryNoConflict("#data-point-caveat").html(featcherCaveat);

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