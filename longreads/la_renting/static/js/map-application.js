var jqueryNoConflict = jQuery;
var fn = fn || {};
var formopen;

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.createMap();

    /*
    jqueryNoConflict("#cancelbutton").click(function(){
        jqueryNoConflict("#theform").hide();
        fn.closeform();
    });
    */

    //https://www.publicinsightnetwork.org/air2/api/public/search?a=6f4d503616e1115157a64bd26b51aec7&q=query_uuid:2e14f63c3352&t=JSON

    //fn.getPinJson("https://www.publicinsightnetwork.org/air2/q/2e14f63c3352.json");

    //PIN.Form.render(fn.PIN_QUERY);

    /*
    jqueryNoConflict('#content-background').click(function(){
        jqueryNoConflict('#content-background').fadeOut('slow');
        jqueryNoConflict('#theform').fadeOut('slow');
    });
    */

    //jqueryNoConflict(document).keydown(function(e){
        //if(e.keyCode==27) {
            //jqueryNoConflict('#content-background').fadeOut('slow');
            //jqueryNoConflict('#theform').fadeOut('slow');
        //}
    //});


});

// begin data configuration object
var fn = {
    createMap: function(){

        jqueryNoConflict("#content-display-canvas").html(
            "<table>" +
            "<thead>" +
            "<tr>" +
            "<th>zipcode</th>" +
            "<th>county</th>" +
            "<th>total housing</th>" +
            "<th>number owned</th>" +
            "<th>number rented</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='appendHere'>" +
            "</tbody>" +
            "</table>"
        );

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

                //console.log(feature);


                /*
                layer.on('mouseover', function (e) {
                    this.setStyle({
                        weight: 2,
                        opacity: 2,
                        fillOpacity: 2,
                    });
                });

                layer.on('mouseout', function (e) {
                    this.setStyle({
                        weight: .8,
                        opacity: .8,
                        fillOpacity: .5,
                    });
                });
                */

                var featcherContent = _.template(
                    "<tr id='zip_<%= name %>'>" +
                    "<td><%= name %></td>" +
                    "<td><%= normalized_zcta_five_county_data_county_proper %></td>" +
                    "<td><%= normalized_zcta_five_county_data_total_housing_units %></td>" +
                    "<td><%= normalized_zcta_five_county_data_own_housing_units_total %></td>" +
                    "<td><%= normalized_zcta_five_county_data_rent_housing_units_total %></td>", feature.properties);

                layer.on('click', function (e) {
                    if (feature.selected === false){
                        this.setStyle({
                            weight: 2,
                            opacity: 2,
                            fillOpacity: 2,
                        });
                        jqueryNoConflict("#appendHere").append(featcherContent);
                        feature.selected = true;
                    } else {
                        this.setStyle({
                            weight: .8,
                            opacity: .8,
                            fillOpacity: .5,
                        });
                        jqueryNoConflict("table #appendHere #zip_" + feature.properties.name).remove();
                        feature.selected = false;
                    }


                    //console.log(feature.properties);

                    /*
                    var popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(html)
                        .openOn(map);
                    */

                });

            }

        }).addTo(map);

        map
            .setView(center, initialZoom)
            .addLayer(stamenToner);

        // let's get lat/lng of a map click
        //map.on('click', fn.onMapClick);

    },

    onMapClick: function(e){
        var popup = L.popup();
        //console.log(e.latlng.lat, e.latlng.lng);

        popup
            .setLatLng(e.latlng)
            .setContent("</div>You clicked the map at " + e.latlng.toString())
            .openOn(map);

            //jqueryNoConflict("#theform").show();

            jqueryNoConflict("input[id='pin-q-15f9abb472d4']").val(e.latlng.lat);
            jqueryNoConflict("input[id='pin-q-7defd64f7f1f']").val(e.latlng.lng);


            //formopen = true;

            //jqueryNoConflict("#form-name").focus();


            jqueryNoConflict('#content-background').css({'opacity' : '0.7'}).fadeIn('fast');
            jqueryNoConflict('#theform').fadeIn('slow');

            jqueryNoConflict('#close').click(function(){
                jqueryNoConflict('#content-display').fadeOut('fast');
                jqueryNoConflict('#theform').fadeOut('fast');
            });


    },

    PIN_QUERY: {
        uuid: '2e14f63c3352',
        divId: '2e14f63c3352',
        opts: {
            includeLegalFooter: true,

            validationErrorMsg: 'Sorry, you have problems!',

            showIntro: false,

            // the thankYou callback is invoked after the Submit button is clicked
            thankYou: function(divId, respData) {
                var div = jQuery('#'+divId);
                var queryMeta = PIN.Form.Registry[divId];
                div.text('Thanks! Your submission is ' + respData.uuid);
            },

            // the onRender callback is invoked after the query HTML is built.
            onRender: function(divId, queryData) {
                var div = jQuery('#'+divId);
                div.prepend('<h2>'+queryData.query.inq_ext_title+'</h2>');
            }
        }
    },

    /*
    getPinJson: function(url){
        jqueryNoConflict.ajax({
            url: url,
            crossDomain: true,
            dataType: "jsonp",
            success: fn.processPinJson
        });


    },

    processPinJson: function(data){
        console.log(data.questions);

        console.log(data.questions[0].ques_value);

        var testTemplate = _.template(
            "<p>The <%= ques_value %> bridge in <%= ques_value %> was built in <%= ques_value %></p>", data.questions[0]);

        jqueryNoConflict('#theform').html(testTemplate);

    },
    */

    /*
    closeform: function(){
        jqueryNoConflict("#theform").hide();
        formopen = false;
    },
    */

}
// end data configuration object